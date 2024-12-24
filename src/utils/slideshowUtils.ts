import JSZip from "jszip";
import { supabase } from "@/integrations/supabase/client";

export const downloadSlideshow = async (videoUrl: string): Promise<void> => {
  const response = await fetch(videoUrl);
  const videoBlob = await response.blob();
  
  const zip = new JSZip();
  zip.file("0307.mp4", videoBlob);
  
  const content = await zip.generateAsync({ type: "blob" });
  const zipUrl = URL.createObjectURL(content);
  
  const a = document.createElement('a');
  a.href = zipUrl;
  a.download = '0307.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(zipUrl);
};

export const pollSlideshowStatus = async (
  id: string,
  onSuccess: (videoUrl: string) => void,
  onError: (message: string) => void,
  onProgress: (progress: number) => void
) => {
  try {
    console.log('Polling slideshow status for ID:', id);
    
    const { data, error } = await supabase
      .from('slideshows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error polling slideshow status:', error);
      onError(error.message);
      return;
    }

    console.log('Slideshow status:', data.status);

    if (data.status === 'completed' && data.video_path) {
      onProgress(100);
      onSuccess(data.video_path);
    } else if (data.status === 'error') {
      onError(data.error_message || "Failed to create slideshow");
    } else {
      onProgress(40);
      // Continue polling
      setTimeout(() => pollSlideshowStatus(id, onSuccess, onError, onProgress), 2000);
    }
  } catch (error) {
    console.error('Error in pollSlideshowStatus:', error);
    onError('Failed to check slideshow status');
  }
};

export const createSlideshow = async (
  images: string[],
  onProgress: (progress: number) => void
): Promise<string> => {
  console.log('Starting slideshow creation');
  onProgress(10);

  try {
    // Create slideshow record
    const { data: slideshow, error: insertError } = await supabase
      .from('slideshows')
      .insert({})
      .select()
      .single();

    if (insertError) {
      console.error('Error creating slideshow record:', insertError);
      throw insertError;
    }

    console.log('Created slideshow record:', slideshow.id);
    onProgress(20);

    // Start processing with Edge Function
    const { error: processError } = await supabase.functions.invoke('create-slideshow', {
      body: { slideshow_id: slideshow.id, images }
    });

    if (processError) {
      console.error('Error invoking create-slideshow function:', processError);
      throw processError;
    }

    console.log('Successfully invoked create-slideshow function');
    return slideshow.id;

  } catch (error) {
    console.error('Error in createSlideshow:', error);
    throw error;
  }
};