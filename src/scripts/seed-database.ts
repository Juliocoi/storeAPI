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
  ) {}
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
      {
        name: "Home Center Ferreira Costa Tamarineira",
        address: "Rua Cônego Barata",
        number: "275",
        bairro: "Tamarineira",
        city: "Recife",
        state: "PE",
        storeType: "PDV",
        postalCode: "52051020",
        location: {
          type: "Point",
          coordinates: [-34.90284, -8.03107],
        },
      },
      {
        name: "Home Center Ferreira Costa Imbiribeira",
        address: "Avenida Mal. Mascarenhas de Morais",
        number: "2967",
        bairro: "Imbiribeira",
        city: "Recife",
        state: "PE",
        storeType: "LOJA",
        postalCode: "51150905",
        location: {
          type: "Point",
          coordinates: [-34.91093, -8.11199],
        },
      },

      // PDV stores in Rio de Janeiro
      {
        name: "PDV Copacabana",
        address: "Rua do Sossego",
        number: "341",
        bairro: "Piedade",
        city: "aboatão dos Guararapes",
        state: "PE",
        storeType: "PDV",
        postalCode: "22021000",
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
        state: "MG",
        storeType: "PDV",
        postalCode: "30130151",
        location: {
          type: "Point",
          coordinates: [-43.9352, -19.9353],
        },
      },

      // Online stores (LOJA)
      {
        name: "Loja Online SP",
        address: "Rua Oscar Freire",
        number: "123",
        bairro: "Jardins",
        city: "São Paulo",
        state: "SP",
        storeType: "LOJA",
        postalCode: "01426001",
        location: {
          type: "Point",
          coordinates: [-46.6693, -23.5638],
        },
      },
      {
        name: "Loja Online RJ",
        address: "Avenida Rio Branco",
        number: "156",
        bairro: "Centro",
        city: "Rio de Janeiro",
        state: "RJ",
        storeType: "LOJA",
        postalCode: "20040-901",
        location: {
          type: "Point",
          coordinates: [-43.1773, -22.9068],
        },
      },
      {
        name: "Loja Online Recife",
        address: "Avenida Boa Viagem",
        number: "200",
        bairro: "Boa Viagem",
        city: "Recife",
        state: "PE",
        storeType: "LOJA",
        postalCode: "51011000",
        location: {
          type: "Point",
          coordinates: [-34.8809, -8.1208],
        },
      },
      {
        name: "Loja Online Brasília",
        address: "SHN Quadra 5",
        number: "Bloco J",
        bairro: "Asa Norte",
        city: "Brasília",
        state: "DF",
        storeType: "LOJA",
        postalCode: "70705000",
        location: {
          type: "Point",
          coordinates: [-47.8825, -15.7942],
        },
      },
      {
        name: "Loja Online Porto Alegre",
        address: "Avenida Goethe",
        number: "100",
        bairro: "Rio Branco",
        city: "Porto Alegre",
        state: "RS",
        storeType: "LOJA",
        postalCode: "90430100",
        location: {
          type: "Point",
          coordinates: [-51.2099, -30.0308],
        },
      },
      {
        name: "Loja Online Florianópolis",
        address: "Avenida Beira Mar Norte",
        number: "2000",
        bairro: "Centro",
        city: "Florianópolis",
        state: "SC",
        storeType: "LOJA",
        postalCode: "88015700",
        location: {
          type: "Point",
          coordinates: [-48.5527, -27.5968],
        },
      }
    ];
    console.log(stores);
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
class SeedModule {}

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
