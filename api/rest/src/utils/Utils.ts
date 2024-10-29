import slugify from "slugify";

export class Utils {
  static buildSlug(name: string): string {
    return slugify(name, { lower: true, replacement: "-", trim: true });
  }
}