import Season from "./season";

export default interface Show {
  id: number,
  name: string,
  overview: string,
  seasons: Season[]
}