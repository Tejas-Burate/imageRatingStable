import mongoose, { Document, Schema } from "mongoose";


const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [
      {
        serviceName: {
          type: String,
          required: true,
        },
        apis: [
          {
            api: {
              type: String,
              required: true,
            },
            methods: [
              {
                type: String,
                enum: ["GET", "POST", "PUT", "DELETE"],
              },
            ],
            allowed: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);



export default mongoose.model("Role", RoleSchema);
