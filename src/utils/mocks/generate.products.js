import { faker } from "@faker-js/faker";

faker.locate = "en";

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.datatype.uuid(),
    stock: faker.datatype.number({
      min: 800,
      max: 1200,
    }),
    status: true,
    stock: faker.datatype.number({
      min: 0,
      max: 30,
    }),
    category: faker.lorem.words(),
  };
};

export default generateProducts