export function manualProductExtraction(fileInfo) {
  // Extract hints dari filename
  const filename = fileInfo.originalname || 'product';
  
  const nameHints = {
    'burger': 'Burger Special',
    'pizza': 'Delicious Pizza', 
    'pasta': 'Italian Pasta',
    'coffee': 'Premium Coffee',
    'juice': 'Fresh Juice',
    'steak': 'Grilled Steak',
    'salad': 'Healthy Salad',
    'cake': 'Sweet Cake',
    'sushi': 'Japanese Sushi',
    'rice': 'Fried Rice'
  };
  
  let productName = 'Special Menu';
  for (const [key, value] of Object.entries(nameHints)) {
    if (filename.toLowerCase().includes(key)) {
      productName = value;
      break;
    }
  }
  
  const descriptions = {
    'Burger': 'Juicy burger with fresh ingredients',
    'Pizza': 'Delicious pizza with premium toppings',
    'Pasta': 'Authentic Italian pasta dish',
    'Coffee': 'Freshly brewed premium coffee',
    'Juice': 'Healthy and refreshing fruit juice',
    'Steak': 'Perfectly grilled premium steak',
    'Salad': 'Fresh and healthy salad mix',
    'Cake': 'Delicious homemade cake',
    'Sushi': 'Fresh Japanese sushi selection',
    'Rice': 'Flavorful fried rice dish'
  };
  
  const description = descriptions[productName.split(' ')[0]] || 'Delicious menu item carefully prepared';
  
  // Price based on product type
  const priceRanges = {
    'Burger': 45000,
    'Pizza': 75000,
    'Pasta': 55000,
    'Coffee': 25000,
    'Juice': 20000,
    'Steak': 120000,
    'Salad': 35000,
    'Cake': 30000,
    'Sushi': 80000,
    'Rice': 40000
  };
  
  const price = priceRanges[productName.split(' ')[0]] || 35000;
  
  return {
    name: productName,
    description: description,
    price: price
  };
}
