// l. 292. Deze file is gewoon handig om alle action vanuit één centraal file te kunnen importeren.
// Zie hoe er hier GEEN import is, gewoon een directe export met verwijzing naar een ander file!

export { 
  addIngredient, 
  removeIngredient,
  initIngredients
} from './burgerBuilder';

export {} from './order';
