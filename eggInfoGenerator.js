
const totalImages = require('./all.json');
const multiplier = require('./multiplier.json');

function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

function getEggInfo(index) {
  let current = 0;

  for (let i = 0; i < totalImages.images.length; i++) {
    let typeGroup = totalImages.images[i];
    for (let j = 0; j < typeGroup.values.length; j++) {
      let colorGroup = typeGroup.values[j];
      if (current <= index && index <= current + colorGroup.values.length - 1) {
        return {
          material: typeGroup.type,
          color: colorGroup.color,
          image: colorGroup.values[index - current],
          type: colorGroup.values.length == 1 ? "ULTRA" :
            colorGroup.values.length <= 20 ? "LEGENDARY" : "RARE"
        }
      } else {
        current += colorGroup.values.length;
      }
    }
  }

  return null;
}

function main() {
  let fs = require('fs');

  // Generate random array
  for (var a=[],i=0;i<6400;++i) a[i]=i;
  a = shuffle(a);
  let str = "";
  for (let i=0;i<6400;++i) str += `${i}: ${a[i]}\n`;
  fs.writeFile(`Eggs/order.txt`, str, function (err) {
    if (err) throw err;
  });

  for (let i = 0; i < 6400; i++) {
    let info = getEggInfo(a[i]);
    if (info) {
      const content = {
        "attributes": [
          {
            "trait_type": "Material",
            "value": info.material
          },
          {
            "trait_type": "Color",
            "value": info.color
          },
          {
            "trait_type": "Multiplier",
            "value": multiplier.multiplier[i]
          },
          {
            "trait_type": "Type",
            "value": info.type
          },
        ],
        "description": "Apymon is a collection of 6400 creatures created by AI which are contained in procedurally designed eggs. What makes these Genesis Eggs special is that they can hold other NFTs, ERC20 and ERC1155 tokens, making them function as your personal vault. No two Apymon creatures or Genesis Eggs are the same, each one is unique and crafted with love.",
        "external_url": "https://apymon.com",
        "image": info.image,
        "name": `Genesis Egg #${i}`
      };

      fs.writeFile(`Eggs/${i}`, JSON.stringify(content), function (err) {
        if (err) throw err;
      });
    }
  }

  console.log("Finished");
}

main();
