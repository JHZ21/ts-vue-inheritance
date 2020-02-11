import axios from "axios";

export const getLearnCard = () =>
  axios({
    method: "get",
    url: "learn/card"
  });

export const getOCententUrl = () =>
  axios({
    method: "POST",
    url: "learn/getocententurl"
  });
