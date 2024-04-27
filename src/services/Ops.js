import axios from "axios";

const postdata = async (url = "", data, token = false) => {
  let tokendata = "";

  if (token) {
    tokendata = "Bearer " + token;
  }

  let response = await axios.post(url, data, {
    headers: { Authorization: tokendata },
  });
  return response.data;
};

const getData = async (url = "", token = false) => {
  if (token) {
    token = "Bearer " + token;
  }

  let response = await axios.get(url, { headers: { Authorization: token } });

  return response.data;
};

const deleteData = async (url = "", token = false) => {
  if (token) {
    token = "Bearer " + token;
  }
  let response = await axios.delete(url, { headers: { Authorization: token } });

  return response.data;
};

const putData = async (url = "", data, token = false) => {
  if (token) {
    token = "Bearer " + token;
  }
  let response = await axios.put(url, data, {
    headers: { Authorization: token },
  });

  return response.data;
};

const postDataContent = async (url = "", data, token = false, contentType) => {
  try {
    let tokenData = "";
    if (token) {
      tokenData = "Bearer " + token;
    }

    let response = await axios.post(url, data, {
      headers: { Authorization: tokenData, contentType: contentType },
    });

    return response.data;
  } catch (error) {}
};

export async function downloadFile(fileUrl, data, token = false) {
  if (token) {
    token = "Bearer " + token;
  }
  axios
    .post(fileUrl, data, {
      responseType: "blob",
      headers: { Authorization: token },
    })
    .then(function (response) {
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], { type: type, encoding: "UTF-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = data.fileName;
      link.click();
    });
}

export { postdata, getData, deleteData, putData, postDataContent };
