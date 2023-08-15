const ipDetails = async () => {
  const response = await fetch(`https://ipinfo.io/?token=48be71f88148b3`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  const ipData = await response.json();
  return ipData;
};

export { ipDetails };