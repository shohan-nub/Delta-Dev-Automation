import { prepo } from "@/repositories/products.repository";
import { products } from "@/db/schema/products";

type Product = typeof products.$inferSelect;

export class ProductService {
  async allProduct() {
    return await prepo.getAll();
  }

  async allProductId(id: string) {
    return await prepo.getbyId(id);
  }

  async deleteProduct(id: string) {
    return await prepo.delete(id);
  }

  async createProduct(
    data: Parameters<typeof prepo.create>[0]
  ) {
    const product = await prepo.create(data);
    let warning: string | undefined;

    try {
      await this.generateEmbedding(product);
    } catch (error) {
      console.error("PRODUCT EMBEDDING ERROR after product was saved:", error);
      warning = "Product saved, but its search index could not be updated.";
    }

    return { data: product, warning };
  }

  async updateProduct(
    data: Parameters<typeof prepo.update>[0],
    id: string
  ) {
    const product = await prepo.update(data, id);

    if (!product) {
      return product;
    }

    let warning: string | undefined;
    try {
      await this.generateEmbedding(product);
    } catch (error) {
      console.error("PRODUCT EMBEDDING ERROR after product was updated:", error);
      warning = "Product updated, but its search index could not be updated.";
    }

    return { data: product, warning };
  }

  private async generateEmbedding(product: Product) {
    const webhook = process.env.N8N_EMBEDDING_WEBHOOK;

    if (!webhook) {
      throw new Error("N8N_EMBEDDING_WEBHOOK is missing");
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        color: product.color,
        size: product.size,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `n8n webhook failed: ${response.status} ${errorText}`
      );
    }
  }
}

export const pservice = new ProductService();