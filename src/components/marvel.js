import React, { useEffect, useState } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardGroup,
} from "reactstrap";
const crypto = require("crypto");

const Marvel = () => {
  const [personajes, setPsjs] = useState([]);
  const [msj, setMsj] = useState("");
  const pubKey = "cc0a1e728a48936a88279442cb70d0ab";
  const pivKey = "c6e9d402cca72d023283f077ee20fb3f028431b1";
  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("personajes") === null) {
        setMsj("No hay conexión");
      } else {
        setMsj("Personajes de Marvel");
        setPsjs(JSON.parse(localStorage.getItem("personajes")));
      }
    } else {
      let ts = Date.now();
      let hash = crypto
        .createHash("md5")
        .update(ts.toString() + pivKey + pubKey)
        .digest("hex");
      const URL =
        "https://gateway.marvel.com:443/v1/public/characters?apikey=" +
        pubKey +
        "&hash=" +
        hash +
        "&ts=" +
        ts;
      fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          setPsjs(res.data.results);
          setMsj("Personajes de Marvel");
          const results = JSON.stringify(res.data.results);
          localStorage.setItem("personajes", results);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const dataPsjs = () =>
    personajes.map((item, i) => {
      console.log(item);
      let desc = "";
      if (item.description === "") {
        desc = "No description";
      } else {
        desc = item.description;
      }
      return (
        <div key={i}>
          <Card key={i}>
            <CardImg
              width="400px"
              height="300px"
              alt="ImagenSuperheroe"
              src={item.thumbnail.path + "." + item.thumbnail.extension}
            />
            <CardBody>
              <CardTitle>{item.name}</CardTitle>
              <CardText>{desc}</CardText>
            </CardBody>
          </Card>
        </div>
      );
    });
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1>{msj}</h1>
        </div>
        <div className="col-12">
          <CardGroup>{dataPsjs()}</CardGroup>
        </div>
      </div>
    </div>
  );
};

export default Marvel;
