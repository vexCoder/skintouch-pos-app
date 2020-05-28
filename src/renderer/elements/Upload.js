import React from "react";
import Fill from "./Fill";
import Card from "./Card";
import { useAppState } from "../../data/Provider";
import { light, dark } from "../../base/theme";
import { drawImageProp } from "../../tools/Snippets";
import Text from "./Text";
import Empty from "./Empty";
import Animate from "../components/Animate";
import { AnimationEnum } from "../../tools/Enum";
import { Row, Col } from "antd";
import Jimp from "jimp";

const splitString = (string, connector) => {
  const arr = string.split("");
  let divisor = 2;
  let res;

  do {
    const count = Math.floor(arr.length / divisor);
    res =
      arr.slice(0, count).join("") +
      connector +
      arr.slice(arr.length - count, arr.length).join("");
    divisor++;
  } while (res.length > 15);

  return res;
};

function isFileImage(file) {
  return file && file["type"].split("/")[0] === "image";
}

export default function Upload(props) {
  const { value, imageData, imageSize, onChange } = props;
  const { theme } = useAppState();

  let dragCounter = 0;

  const [drag, setDrag] = React.useState(false);
  const [filePath, setFilePath] = React.useState(null);

  const canvasRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const dropRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDrag(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter > 0) return;
    setDrag(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (isFileImage(e.dataTransfer.files[0])) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, imageRealSize, imageRealSize);
        setFilePath(e.dataTransfer.files[0].path);
        Jimp.read(e.dataTransfer.files[0].path).then((image) => {
          image
            .scaleToFit(imageRealSize, imageRealSize, Jimp.RESIZE_BICUBIC)
            .getBase64Async(Jimp.MIME_PNG)
            .then((base64) => {
              const image = new Image();
              image.src = base64;
              image.onload = function () {
                drawImageProp(ctx, image, 0, 0, imageRealSize, imageRealSize);
              };
              onChange({ dataUrl: base64, filePath });
            });
        });
      }
    }
  };

  React.useEffect(() => {
    if (imageData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.onload = function () {
        drawImageProp(ctx, image, 0, 0, imageRealSize, imageRealSize);
      };
      image.src = imageData;
    }

    let div = dropRef.current;
    if (div) {
      div.addEventListener("dragenter", handleDragIn);
      div.addEventListener("dragleave", handleDragOut);
      div.addEventListener("dragover", handleDrag);
      div.addEventListener("drop", handleDrop);
    }
    return () => {
      let div = dropRef.current;
      if (div) {
        div.removeEventListener("dragenter", handleDragIn);
        div.removeEventListener("dragleave", handleDragOut);
        div.removeEventListener("dragover", handleDrag);
        div.removeEventListener("drop", handleDrop);
      }
    };
  }, []);

  const imageRealSize = imageSize - 6 * 2;
  return (
    <Fill>
      <Card
        style={{
          padding: "5px",
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          ...props.style,
        }}
      >
        <div ref={dropRef} style={{ height: "100%", width: "100%" }}>
          <Fill
            style={{
              border: `1px dashed ${
                theme === "light" ? light.textSecondary : dark.textSecondary
              }`,
            }}
          >
            {!imageData && (
              <Empty
                iconStyle={{ marginTop: "12%" }}
                styles={{
                  position: "absolute",
                  cursor: "pointer",
                }}
                onClick={() => {
                  inputRef.current.click();
                }}
              />
            )}
            <canvas
              ref={canvasRef}
              width={imageRealSize}
              height={imageRealSize}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                inputRef.current.click();
              }}
            />
          </Fill>
        </div>
      </Card>
      <Row>
        <Col span={24}>
          <Text style={{ marginTop: "5px" }}>File:</Text>
        </Col>
        <Col span={24}>
          <Text style={{ marginTop: "5px" }}>
            {filePath && filePath.length > 15
              ? splitString(filePath, "...")
              : filePath}
          </Text>
        </Col>
      </Row>
      <input
        type="file"
        ref={inputRef}
        style={{ visibility: "hidden", height: 0, position: "absolute" }}
        accept="image/*"
        onChange={async (evt) => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, imageRealSize, imageRealSize);
          setFilePath(evt.target.files[0].path);
          Jimp.read(evt.target.files[0].path).then((image) => {
            image
              .scaleToFit(imageRealSize, imageRealSize, Jimp.RESIZE_BICUBIC)
              .getBase64Async(Jimp.MIME_PNG)
              .then((base64) => {
                const image = new Image();
                image.src = base64;
                image.onload = function () {
                  drawImageProp(ctx, image, 0, 0, imageRealSize, imageRealSize);
                };
                onChange({ dataUrl: base64, filePath });
              });
          });
        }}
      />
    </Fill>
  );
}
