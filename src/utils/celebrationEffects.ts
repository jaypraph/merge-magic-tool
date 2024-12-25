import confetti from 'canvas-confetti';

export const triggerClassicFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    // Launch classic firework explosions
    const positions = [
      { x: Math.random(), y: Math.random() * 0.3 },
      { x: Math.random(), y: Math.random() * 0.5 }
    ];

    positions.forEach(position => {
      // Core explosion
      confetti({
        particleCount: 100,
        spread: 360,
        startVelocity: 30,
        origin: position,
        colors: ['#ff4444', '#ff8844', '#ffff44'],
        ticks: 100,
        decay: 0.95,
        gravity: 1,
        drift: 0,
        scalar: 1
      });

      // Trailing sparks
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 120,
          startVelocity: 25,
          origin: position,
          colors: ['#ffaa44', '#ff4444'],
          ticks: 200,
          decay: 0.9,
          gravity: 0.8,
          drift: 1,
          scalar: 0.8
        });
      }, 100);
    });
  }, 400);
};

export const triggerColorfulStars = () => {
  const end = Date.now() + (3 * 1000);
  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea384c', '#40a9ff', '#52c41a', '#faad14', '#722ed1']
    });
  }, 250);
};

export const triggerModernFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const positions = [
      { x: Math.random(), y: Math.random() * 0.5 },
      { x: Math.random(), y: Math.random() * 0.3 },
      { x: Math.random(), y: Math.random() * 0.7 }
    ];

    positions.forEach(position => {
      confetti({
        particleCount: 50,
        spread: 360,
        startVelocity: 45,
        origin: position,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
        ticks: 200,
        scalar: 1.2,
        gravity: 1.2,
        drift: 0,
        shapes: ['circle', 'square', 'star'],
        zIndex: 200
      });
    });
  }, 250);
};