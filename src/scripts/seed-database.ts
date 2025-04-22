import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Store, StoreSchema } from "src/store/schema/Store.schema";

/**
 * Service to handle database seeding operations
 */
class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>
  ) { }
  //constructor(@InjectConnection() private readonly connection: Connection) {}
  /**
   * Clear existing data and seed stores
   */
  async seed() {
    this.logger.log("Starting database seeding...");

    // Clear existing data
    await this.clearDatabase();

    // Seed stores
    await this.seedStores();

    this.logger.log("Database seeding completed!");
  }

  /**
   * Clear all collections
   */
  async clearDatabase() {
    this.logger.log("Clearing database...");
    await this.storeModel.deleteMany({});
    this.logger.log("Database cleared!");
  }

  /**
   * Seed stores data
   */
  async seedStores() {
    this.logger.log("Seeding stores...");

    const stores = [
      // PDV stores in São Paulo
      //{
      //   name: "Home Center Ferreira Costa Tamarineira",
      //   address: "Rua Cônego Barata",
      //   number: "275",
      //   bairro: "Tamarineira",
      //   city: "Recife",
      //   state: "PERNAMBUCO",
      //   postalCode: "52051020",
      //   shippingTimeInDays: 1,
      //   storeType: "PDV",
      //   location: {
      //     type: "Point",
      //     coordinates: [-34.90284, -8.03107],
      //   },
      // },
      {
        name: "Home Center Ferreira Costa Imbiribeira",
        address: "Avenida Mal. Mascarenhas de Morais",
        number: "2967",
        bairro: "Imbiribeira",
        city: "Recife",
        state: "PERNAMBUCO",
        postalCode: "51150905",
        shippingTimeInDays: 2,
        storeType: "PDV",
        location: {
          type: "Point",
          coordinates: [-34.91093, -8.11199],
        },
      },

      // PDV stores in Rio de Janeiro
      {
        name: "PDV Copacabana",
        address: "Av. Atlântica",
        number: "341",
        bairro: "Copacabana",
        city: "Rio de Janeiro",
        state: "RIO DE JANEIRO",
        postalCode: "22021001",
        shippingTimeInDays: 1,
        storeType: "PDV",
        location: {
          type: "Point",
          coordinates: [-43.1823, -22.9711],
        },
      },

      // PDV stores in Belo Horizonte
      {
        name: "PDV Savassi",
        address: "Rua Pernambuco",
        number: "1000",
        bairro: "Savassi",
        city: "Belo Horizonte",
        state: "MINAS GERAIS",
        postalCode: "30130151",
        shippingTimeInDays: 1,
        storeType: "PDV",
        location: {
          type: "Point",
          coordinates: [-43.9352, -19.9353],
        },
      },

      // Online stores (LOJA)
      {
        name: "Loja Online SP",
        address: "Rua Oscar Freire",
        number: "789",
        bairro: "Jardim Paulista",
        city: "São Paulo",
        state: "SÃO PAULO",
        postalCode: "01426003",
        shippingTimeInDays: 2,
        storeType: "LOJA",
        location: {
          type: "Point",
          coordinates: [-46.66832, -23.56384],
        },
      },
      {
        name: "Loja Online RJ",
        address: "Avenida Rio Branco",
        number: "156",
        bairro: "Centro",
        city: "Rio de Janeiro",
        state: "RIO DE JANEIRO",
        postalCode: "20040901",
        shippingTimeInDays: 3,
        storeType: "LOJA",
        location: {
          type: "Point",
          coordinates: [-43.1773, -22.9068],
        },
      },
      {
        name: "Loja Online PB",
        address: "R. Abdias Gomes de Almeida",
        number: "800",
        bairro: "Tambauzinho",
        city: "João Pessoa",
        state: "PARAÍBA",
        postalCode: "58042-900",
        shippingTimeInDays: 2,
        storeType: "LOJA",
        location: {
          type: "Point",
          coordinates: [-34.84309, -7.12212],
        },
      },
      {
        name: "Loja Online BSB",
        address: "SDN, Conjunto Nacional Bsb",
        number: "Bloco J",
        bairro: "Asa Norte",
        city: "Brasília",
        state: "DISTRITO FEDERAL",
        postalCode: "70077900",
        shippingTimeInDays: 2,
        storeType: "LOJA",
        location: {
          type: "Point",
          coordinates: [-47.88317, -15.79128],
        },
      },
      {
        name: "Loja Online Porto Alegre",
        address: "Rua Fernandes Vieira",
        number: "401",
        bairro: "Bom Fim",
        city: "Porto Alegre",
        state: "RIO GRANDE DO SUL",
        postalCode: "90035090",
        shippingTimeInDays: 2,
        storeType: "LOJA",
        location: {
          type: "Point",
          coordinates: [-51.21104, -30.03272],
        },
      },
      {
        name: "Loja Online Florianópolis",
        address: "Rua Jerônimo Coelho,",
        number: "96",
        bairro: "Centro",
        city: "Florianópolis",
        state: "SANTA CATARINA",
        postalCode: "88010030",
        shippingTimeInDays: 2,
        storeType: "LOJA",
        location: {
          type: "Point",
          coordinates: [-48.55278, -27.59665],
        },
      }
    ];

    await this.storeModel.insertMany(stores);
    this.logger.log(`${stores.length} stores have been seeded!`);
  }
}

/**
 * Module for handling database seeding
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("DATABASE"),
      }),
    }),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  providers: [SeedService],
})
class SeedModule { }

/**
 * Bootstrap the seed process
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.seed();
    await app.close();
    process.exit(0);
  } catch (error) {
    const logger = new Logger("Bootstrap");
    logger.error(
      `Error during database seeding: ${error.message}`,
      error.stack
    );
    await app.close();
    process.exit(1);
  }
}

bootstrap();
