import {ImageShoot} from "../cam/gallery";
import {useIndexedDB} from "react-indexed-db-hook";

export const SchemaImage = "igi_image"
export const SchemaVideo = "igi_video"

export const DBConfig = {
  name: "igi_db",
  version: 1,
  objectStoresMeta: [
    {
      store: SchemaImage,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "data", keypath: "data", options: { unique: false } },
        { name: "createdAt", keypath: "createdAt", options: { unique: false } },
        { name: "uploadStatus", keypath: "uploadStatus", options: { unique: false } },
      ],
    },
    {
      store: SchemaVideo,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "data", keypath: "data", options: { unique: false } },
        { name: "createdAt", keypath: "createdAt", options: { unique: false } },
        { name: "uploadStatus", keypath: "uploadStatus", options: { unique: false } },
      ],
    },
  ],
};


export async function AddItemToDB(schema: string, item: ImageShoot) {
  const {add} = useIndexedDB(schema)
  const id = await add({name: item.name, data: item.data})
  return id
}

export async function GetAllItemFromDB(schema: string){
  const { getAll } = useIndexedDB(schema);
  const ds = await getAll()
  return ds
}
