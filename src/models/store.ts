import mongoose from 'mongoose';

interface IStore extends mongoose.Document {
  name: string;
  address: string;
  bairro: string;
  city: string;
  uf: string;
  cep: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

const storeSchema = new mongoose.Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, 'Name required.'],
    },
    address: {
      type: String,
      required: [true, 'Address required'],
    },
    bairro: {
      type: String,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    uf: {
      type: String,
      required: [true, 'UF is required'],
    },
    cep: {
      type: String,
      require: [true, 'CEP required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: [true, 'Location required in coordinate style.'],
      },
      coordinates: { type: [Number], required: true }, // ordem: [longitude, latitude]
    },
  },
  { timestamps: true },
);

storeSchema.index({ location: '2dsphere' });

export const Store = mongoose.model('Store', storeSchema);
