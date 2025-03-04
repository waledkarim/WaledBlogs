//todo
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";

//todo
// Function to handle image uploads via URL
const uploadImageByURL = (e) => {
//   let link = new Promise((resolve, reject) => {
//     try {
//       resolve(e);
//     } catch (err) {
//       reject(err);
//     }
//   });

//   return link.then((url) => {
//     return {
//       success: 1,
//       file: { url }
//     };
//   });
};


export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true
  },
  image: {
    class: Image,
    config: {
      uploader: {

        async uploadByFile(file) {
          const formData = new FormData();
          formData.append('img', file);

          const response = await axios(import.meta.env.VITE_SERVER_DOMAIN + '/upload', {
            method: 'POST',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          const result = response.data;

          return {
            success: 1,
            file: {
              url: result.url, // the URL your server returns for displaying the image
            }
          };


        },

      }
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2
    }
  },
  quote: {
    class: Quote,
    inlineToolbar: true
  },
  marker: Marker,
  inlineCode: InlineCode
};
