import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMany, count } = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    article: {
      findMany,
      count,
    },
  },
}));

import { GET } from "./route";

function createRequest(search = "") {
  return new Request(`http://localhost/api/articles${search}`);
}

describe("GET /api/articles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
  });

  it.each(["?page=0", "?page=abc", "?limit=0", "?limit=abc"])(
    "returns 400 for invalid pagination parameter %s without querying Prisma",
    async (search) => {
      const response = await GET(createRequest(search));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toMatchObject({ error: "Invalid pagination parameters" });
      expect(findMany).not.toHaveBeenCalled();
      expect(count).not.toHaveBeenCalled();
    }
  );

  it("defaults omitted pagination values to page 1 and limit 100", async () => {
    const response = await GET(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 100,
      })
    );
    expect(body.pagination).toMatchObject({
      page: 1,
      limit: 100,
    });
  });

  it("caps valid limits greater than 200", async () => {
    const response = await GET(createRequest("?page=2&limit=250"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 200,
        take: 200,
      })
    );
    expect(body.pagination).toMatchObject({
      page: 2,
      limit: 200,
    });
  });
});
