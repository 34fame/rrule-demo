const getItems = async (collection) => {
  let config = {
    method: "GET",
    url: BASEURL + "/" + collection,
    headers: {
      Accept: "application/json",
    },
  };
  let result = await axios(config);

  if (result.status === 200) {
    let res = {
      success: true,
      data: result.data,
    };
    return res;
  } else {
    console.error("api", "getItems", "error", result.status, result.statusText);
    let res = {
      success: false,
      status: result.status,
      statusText: result.statusText,
    };
    return res;
  }
};

const getItem = async (collection, id) => {
  let config = {
    method: "GET",
    url: BASEURL + "/" + collection + "/" + id,
    headers: {
      Accept: "application/json",
    },
  };
  let result = await axios(config);

  if (result.status === 200) {
    let res = {
      success: true,
      data: result.data,
    };
    return res;
  } else {
    console.error("api", "getItem", "error", result.status, result.statusText);
    let res = {
      success: false,
      status: result.status,
      statusText: result.statusText,
    };
    return res;
  }
};

const createItem = async (collection, item) => {
  let config = {
    method: "POST",
    url: BASEURL + "/" + collection,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: { ...item },
  };
  let result = await axios(config);

  if (result.status === 201 || result.status === 200) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    console.error(
      "api",
      "createItem",
      "error",
      result.status,
      result.statusText
    );
    return {
      success: false,
      status: result.status,
      statusText: result.statusText,
    };
  }
};

const updateItem = async (collection, id, updates) => {
  console.log("api", collection, id, updates);
  let config = {
    method: "PUT",
    url: BASEURL + "/" + collection + "/" + id,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: { ...updates },
  };
  let result = await axios(config);

  if (result.status === 200) {
    let res = {
      success: true,
      data: result.data,
    };
    return res;
  } else {
    console.error("api", "getItem", "error", result.status, result.statusText);
    let res = {
      success: false,
      status: result.status,
      statusText: result.statusText,
    };
    return res;
  }
};

const deleteItem = async (collection, id) => {
  let config = {
    method: "DELETE",
    url: BASEURL + "/" + collection + "/" + id,
    headers: {
      Accept: "*/*",
    },
  };
  let result = await axios(config);

  if (result.status === 200 || result.status === 204) {
    return {
      success: true,
    };
  } else {
    console.error(
      "api",
      "deleteItem",
      "error",
      result.status,
      result.statusText
    );
    return {
      success: false,
      status: result.status,
      statusText: result.statusText,
    };
  }
};

export { getItems, getItem, createItem, updateItem, deleteItem };
