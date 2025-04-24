import axios, { AxiosResponse } from "axios";

export const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.setAttribute("download", fileName);
  link.setAttribute("target", "_blank");
  link.setAttribute("href", url);

  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const createDownloadLink = async (
  url: string | null,
  fileName: string,
  objectUrl: string | null,
) => {
  if (objectUrl) {
    downloadFile(objectUrl, fileName);
    return;
  }

  if (url) {
    const response: AxiosResponse = await axios.get(url, {
      responseType: "blob",
    });

    if (response.status === 200) {
      const { data } = response;
      downloadFile(URL.createObjectURL(data), fileName);
    }
  }
};
