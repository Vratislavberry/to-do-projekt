async function Call(baseUri, useCase, dtoIn, method) {
  // return fetch
  let response;
  // if method is falsy (NaN, undefined) or "GET"
  // clearer: (!method || (method === "get"))
  if (!method || method === "get") {
    response = await fetch(
      `${baseUri}/${useCase}${
        // sends dtoIn if exists && contains keys, else ""
        dtoIn && Object.keys(dtoIn).length 
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`
    );
  // if method is "POST"
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// is redirect in package.json (only in development) by "proxy": "http://localhost:8888",
const baseUri = process.env.REACT_APP_API_URL;
// Main FetchHelper object

const FetchHelper = {
  item: {
    create: async (dtoIn) => {
      return await Call(baseUri, "item/create", dtoIn, "post");
    },
    listByListId: async (dtoIn) => {
      return await Call(baseUri, "list/getById", dtoIn, "get");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "item/edit", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "item/delete", dtoIn, "post");
    },

  },

  list: {
    create: async (dtoIn) => {
      return await Call(baseUri, "list/create", dtoIn, "post");
    },
    list: async () => {
      return await Call(baseUri, "list/list", null, "get");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "list/update", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "list/delete", dtoIn, "post");
    }
  },
};


// Mock fetch helper for testing without backend


export default FetchHelper;
