export interface Subcategory {
  name: string;
  keywords: string[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export const INITIAL_DATA: Category[] = [
  {
    id: 'landscapes',
    name: 'LANDSCAPES',
    subcategories: [
      {
        name: 'Nature',
        keywords: [
          'Forest', 'Clouds', 'Sky', 'Bird', 'Flowers',
          'Poppy', 'Poppy flowers', 'Lake', 'Lake view',
          'Trees', 'Path', 'Golden hour', 'Nature', 'Hills',
          'Rolling hills'
        ]
      },
      {
        name: 'Places',
        keywords: [
          'Grand Canyon', 'Capetown South Africa', 'Colorado River',
          'English countryside', 'Yosemite', 'Paris', 'Switzerland',
          'Dolomites', 'Alps', 'Castle', 'National park', 'Amsterdam'
        ]
      },
      {
        name: 'Seasonal & Weather',
        keywords: [
          'Snow', 'Snowflake', 'Snowbird', 'Ice', 'Winter',
          'Dark night', 'Northern lights', 'Autumn leaves',
          'Sunrise', 'Morning', 'Morning sun', 'Starry sky'
        ]
      },
      {
        name: 'Structures',
        keywords: [
          'Bridge', 'Wooden bridge', 'Church', 'Christ church',
          'Castle', 'Village', 'Holiday village', 'Road',
          'House', 'Wooden house'
        ]
      }
    ]
  },
  {
    id: 'christmas',
    name: 'CHRISTMAS',
    subcategories: [
      {
        name: 'Santa Claus',
        keywords: [
          'Santa Claus', 'Mrs Claus', 'Santa Claus Tracker',
          'Santa Claus Sleigh', 'Reindeer', 'Rudolph', 'Snow',
          'Snowflake', 'Christmas Eve'
        ]
      },
      {
        name: 'Decorations',
        keywords: [
          'Christmas Tree', 'Christmas Ornaments', 'Christmas Wreath',
          'Mistletoe', 'Pine Tree', 'Holly Leaves', 'Poinsettias',
          'Christmas Garland', 'Red Ribbon'
        ]
      },
      {
        name: 'Trains',
        keywords: [
          'Polar Express', 'Steam Train', 'Thomas Train',
          'Choo Choo Train', 'Orient Express', 'Toy Train'
        ]
      },
      {
        name: 'Food & Sweets',
        keywords: [
          'Gingerbread', 'Gingerbread House', 'Chocolate Strawberry',
          'Strawberries', 'Mulberries', 'Holly Berries',
          'Wild Berries', 'Christmas Dinner'
        ]
      }
    ]
  },
  {
    id: 'stilllife',
    name: 'STILL LIFE',
    subcategories: [
      {
        name: 'Fast Food & Burgers',
        keywords: [
          'McDonalds', 'Fast food', 'Chicken', 'Chicken wings', 'Chicken nuggets',
          'Foodie', 'Chicken tenders', 'Fried chicken', 'French fries', 'Burger',
          'Hamburger', 'Cheeseburger', 'Chicken burger', 'Best burger',
          'Vegan burger', 'Tasty burger', 'Burger box'
        ]
      },
      {
        name: 'Mexican Food',
        keywords: [
          'Taco Bell', 'Taco', 'Birria tacos', 'Mexican', 'Taco time',
          'Taco truck', 'Taco Tuesday', 'Chicken tacos', 'Taco seasoning',
          'Breakfast taco', 'Tacos and tequila', 'Taco bar', 'Taco shell',
          'Taco stand', 'Pink taco', 'Taco sauce', 'National taco day',
          'Tacos are life', 'Burritos', 'Mi burrito sabanero', 'Breakfast burrito',
          'Burrito bowl', 'Burrito recipe', 'Burrito blanket', 'National burrito day',
          'Burrito game', 'Tortilla', 'Tortilla chips', 'Tortilla wraps',
          'Corn tortillas', 'Tortilla press', 'Flour tortillas', 'Homemade tortillas',
          'Nacho chip', 'Tortilla bread', 'Tortilla maker', 'Tortilla flat'
        ]
      },
      {
        name: 'Pizza & Italian',
        keywords: [
          'Pizza', 'Pizza near me', 'Milano', 'Pepperoni', 'Pizza oven',
          'Pizza delivery', 'Pizza place', 'Deep dish pizza', 'Pizza dough',
          'Pizza sauce recipe', 'Pizza Margherita', 'Pizza deals',
          'Chicago style pizza', 'Pizza rolling', 'Pizza party', 'Pizza shop',
          'Pizza man', 'Pizza slice', 'Vegan pizza', 'Pizza menu',
          'Hawaiian pizza', 'Pizza stone', 'Pizza baking stone', 'Pizza planet',
          'Pizza pan', 'Pizza png', 'Cheap pizza', 'Pizza takeaway',
          'Brick oven pizza', 'Pizza base', 'Pizza peel', 'Krusty krab pizza',
          'Pizza crust'
        ]
      },
      {
        name: 'Asian Cuisine',
        keywords: [
          'Ramen', 'Pasta', 'Noodles', 'Golden noodle', 'Udon', 'Noodle recipes',
          'Ramen noodles', 'Udon noodles', 'Rice noodles', 'Spicy noodles',
          'Soba noodles', 'Egg noodles', 'Korean noodles', 'Chinese noodles',
          'Pancit canton', 'Instant noodles', 'Dandan noodle', 'Mukbang noodles',
          'Chicken noodles', 'Chow mein noodles', 'Noodle soup', 'Korean ramen',
          'Pho noodle soup', 'Top ramen', 'Japanese noodles', 'Low carb pasta',
          'Homemade noodle', 'Potato noodles', 'Spaghetti noodles'
        ]
      },
      {
        name: 'Fruits & Produce',
        keywords: [
          'Fruit', 'Lemon', 'Lemon shark', 'Lemon tea', 'Lemon cake recipe',
          'Lemon bottle', 'Strawberry lemonade', 'Lemon verbena', 'Lemon bars recipe',
          'Lemon crusher', 'Lemongrass tea', 'Apricot', 'Apricot color',
          'Dried apricot', 'Apricot seeds', 'Apricot tree', 'Apricot dress',
          'Apricot jam', 'Apricot scrub', 'Apricot oil', 'Apricot images',
          'Apricot blossom', 'Watermelon', 'Peach', 'Grapes', 'Pomegranate'
        ]
      },
      {
        name: 'Flowers & Plants',
        keywords: [
          'Roses', 'Flowers', 'Peonia flower', 'Peony bouquet', 'Infinity roses',
          'Eternal roses', 'Red marigolds', 'Daisy', 'Daisy flowers',
          'African daisies', 'Tulip', 'White daisies', 'Tulip flowers',
          'Tulip bouquet', 'Tulip meaning', 'Pink tulips', 'Marigolds',
          'Shasta daisy', 'Camelia', 'Camelia flower', 'Camelia oil', 'Orchid',
          'Orchid flowers', 'Black orchid', 'Orchid care', 'Wild orchids',
          'White orchids', 'Orchid pot', 'Purple orchid', 'Ghost orchid',
          'Chrysanthemum', 'Chrysanthemum flower', 'Chrysanthemum tea'
        ]
      },
      {
        name: 'Beverages',
        keywords: [
          'Coffee', 'Latte', 'Chai latte', 'Pumpkin spice latte', 'Cafe latte',
          'Latte art', 'Iced latte', 'Espresso cups', 'Chai tea latte',
          'Caramel latte', 'Champagne', 'Champagne supernova', 'Moet champagne',
          'Champagne glass', 'Wine', 'Wine bar', 'Red wine', 'Beer', 'Homebrewing',
          'Glass of beer', 'Coca cola', 'Cola', 'Diet coke'
        ]
      },
      {
        name: 'Desserts & Sweets',
        keywords: [
          'Cake', 'Cheesecake', 'Cupcake', 'Birthday cake', 'Chocolate cake',
          'Red velvet cake', 'Cake shop', 'Cake decoration', 'Tart', 'Vanilla',
          'Donuts', 'Chocolate donuts', 'Mini doughnut', 'Cider doughnuts',
          'Jelly doughnut', 'Apple cider donut', 'Doughnut chart',
          'Doughnut clipart', 'Donut wall', 'Sprinkle donut', 'Pink donut'
        ]
      }
    ]
  }
];