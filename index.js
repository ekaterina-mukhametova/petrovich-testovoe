let products;
const Container = document.querySelector(".product__area");
const RoubleBlack = document.querySelector("#rouble__b");
const RoubleGrey = document.querySelector("#rouble__g");
const IcCart = document.querySelector(".ic_cart");
const Hidden = document.querySelector("#svg");
var stepperArrowArr = [];
var stepperInputArr = [];
var goldPriceArr = [];
var retailPriceArr = [];
var unitArr = [];
let isPriceForAlt = true;

Hidden.style.display = "none";

function makeRequest (method, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      done(null, xhr.response);
    };
    xhr.onerror = function () {
      done(xhr.response);
    };
    xhr.send();
  }
  
  makeRequest('GET', 'https://raw.githubusercontent.com/tiny-moron/petrovich-testovoe/master/products.json', function (err, datums) {
    if (err) { throw err; }
    products = JSON.parse(datums);
  });

  document.addEventListener("DOMContentLoaded", () => {
    let loop = () => {
      if (products !== undefined) {
        init(products);
        for (let i = 0; i < stepperArrowArr.length; i++) {
          stepperArrowArr[i].addEventListener("click", () => {
            if (i % 2 === 0) stepperInputArr[Math.floor(i / 2)].value++;
            else stepperInputArr[Math.floor(i / 2)].value--;
            if (stepperInputArr[Math.floor(i / 2)].value < 1) stepperInputArr[Math.floor(i / 2)].value = 1;
            goldPriceArr[Math.floor(i / 2)].textContent = ((isPriceForAlt ? products[Math.floor(i / 2)]["priceGoldAlt"] : products[Math.floor(i / 2)]["priceGold"]) * stepperInputArr[Math.floor(i / 2)].value).toFixed(2);
            retailPriceArr[Math.floor(i / 2)].textContent = ((isPriceForAlt ? products[Math.floor(i / 2)]["priceRetailAlt"] : products[Math.floor(i / 2)]["priceRetail"]) * stepperInputArr[Math.floor(i / 2)].value).toFixed(2);
          })
        }
        for (let i = 0; i < unitArr.length; i++) {
          unitArr[i].addEventListener("click", () => {
            if (unitArr[i].classList.contains("unit--active") === false) {
              unitArr[i].classList.toggle("unit--active");
              if (i % 2 === 0) {
                unitArr[i + 1].classList.toggle("unit--active");
                goldPriceArr[Math.floor(i / 2)].textContent = (products[Math.floor(i / 2)]["priceGoldAlt"] * stepperInputArr[Math.floor(i / 2)].value).toFixed(2).split('.').join(',');
                retailPriceArr[Math.floor(i / 2)].textContent = (products[Math.floor(i / 2)]["priceRetailAlt"] * stepperInputArr[Math.floor(i / 2)].value).toFixed(2).split('.').join(',');
              }
              else {
                unitArr[i - 1].classList.toggle("unit--active");
                goldPriceArr[Math.floor(i / 2)].textContent = (products[Math.floor(i / 2)]["priceGold"] * stepperInputArr[Math.floor(i / 2)].value).toFixed(2).split('.').join(',');
                retailPriceArr[Math.floor(i / 2)].textContent = (products[Math.floor(i / 2)]["priceRetail"] * stepperInputArr[Math.floor(i / 2)].value).toFixed(2).split('.').join(',');
              } 
              isPriceForAlt = !isPriceForAlt;
            }
          })
        }
      } else {
        window.setTimeout(loop, 100);
      }
    };
    loop();
  });

function init(products) {
  for(let i = 0; i < products.length; i++) {
    let productsSection = document.createElement("div");
    productsSection.id = "products_section";
    Container.append(productsSection);  
      
    let productsPage = document.createElement("div");
    productsPage.classList.add("products_page", "pg_0");
    productsSection.append(productsPage); 

    let product = document.createElement("div");
    product.classList.add("product", "product_horizontal");
    productsPage.append(product);

    let productCode = document.createElement("span");
    productCode.textContent = `Код: ${products[i]["code"]}`;
    productCode.classList.add("product_code");
    product.append(productCode);

    let productStatusTooltipContainer = document.createElement("div");
    productStatusTooltipContainer.classList.add("product_status_tooltip_container");
    product.append(productStatusTooltipContainer);
    let productStatus = document.createElement("span");
    productStatus.classList.add("product_status");
    productStatusTooltipContainer.append(productStatus);
    if (products[i]["isActive"]) productStatus.textContent = "Наличие";
   
    let productPhoto = document.createElement("div");
    productPhoto.classList.add("product_photo");
    product.append(productPhoto);
    let productPhotoLink = document.createElement("a");
    productPhotoLink.classList.add("url--link", "product__link");
    productPhoto.append(productPhotoLink);
    productPhotoLink.href = "#";
    let productPhotoIMG = document.createElement("img");
    productPhotoLink.append(productPhotoIMG);
    productPhotoIMG.src = "https:" + products[i]["primaryImageUrl"].slice(0, -4) + "_220x220_1" + products[i]["primaryImageUrl"].slice(-4);

    let productDescription = document.createElement("div");
    productDescription.classList.add("product_description");
    product.append(productDescription);
    let productDescriptionLink = document.createElement("a");
    productDescriptionLink.classList.add("product__link");
    productDescriptionLink.href = "#";
    productDescription.append(productDescriptionLink);
    productDescriptionLink.textContent = products[i]["title"];

    let productTags = document.createElement("div");
    productTags.classList.add("product_tags", "hidden-sm");
    product.append(productTags);
    let productTagsP = document.createElement("p");
    productTagsP.textContent = "Могут понадобиться:"
    productTags.append(productTagsP);
    let assocProducts = products[i]["assocProducts"].split("\n");
    for (let j = 0; j < assocProducts.length; j++) {
      let productTagsLink = document.createElement("a");
      productTagsLink.classList.add("url--link");
      productTagsLink.href = "#";
      productTags.append(productTagsLink);
      productTagsLink.textContent = " " + assocProducts[j].slice(0, -1);
      if (j < assocProducts.length - 1) productTagsLink.textContent += ",";
      else productTagsLink.textContent += ".";
    }

    let productUnits = document.createElement("div");
    productUnits.classList.add("product_units");
    product.append(productUnits);
    let unitWrapper = document.createElement("div");
    unitWrapper.classList.add("unit--wrapper");
    productUnits.append(unitWrapper);

    let unitFullAlt = document.createElement("div");
    unitFullAlt.classList.add("unit--select", "unit--active");
    unitArr.push(unitFullAlt);
    unitWrapper.append(unitFullAlt);
    let unitFullAltP = document.createElement("p");
    unitFullAltP.classList.add("ng-binding");
    unitFullAlt.append(unitFullAltP);
    unitFullAltP.textContent = "За " + chooseYourFighter(products[i]["unitFullAlt"]);
    
    if (products[i]["unitFull"] !== products[i]["unitFullAlt"]) {
      let unitFull = document.createElement("div");
      unitFull.classList.add("unit--select");
      unitArr.push(unitFull);
      unitWrapper.append(unitFull);
      let unitFullP = document.createElement("p");
      unitFullP.classList.add("ng-binding");
      unitFull.append(unitFullP);
      unitFullP.textContent = "За " + chooseYourFighter(products[i]["unitFull"]);
    }

    let productPriceClubCard = document.createElement("p");
    productPriceClubCard.classList.add("product_price_club_card");
    product.append(productPriceClubCard);
    let productPriceClubCardText = document.createElement("span");
    productPriceClubCardText.classList.add("product_price_club_card_text");
    productPriceClubCardText.innerHTML = "По карте <br> клуба";
    productPriceClubCard.append(productPriceClubCardText);
    let goldPrice = document.createElement("span");
    goldPrice.classList.add("goldPrice");
    goldPrice.textContent = products[i]["priceGoldAlt"].toFixed(2).toString().split('.').join(',');
    productPriceClubCard.append(goldPrice);
    goldPriceArr.push(goldPrice);
    let RoubleBlackP = document.createElement("span");
    RoubleBlackP.classList.add("rouble__i", "black__i");
    productPriceClubCard.append(RoubleBlackP);
    let RoubleBlackDouble = RoubleBlack.cloneNode(true);
    RoubleBlackP.append(RoubleBlackDouble);

    let productPriceDefault = document.createElement("p");
    productPriceDefault.classList.add("product_price_default");
    product.append(productPriceDefault);
    let retailPrice = document.createElement("span");
    retailPrice.classList.add("retailPrice");
    productPriceDefault.append(retailPrice);
    productPriceDefault.append(retailPrice);
    retailPrice.textContent = products[i]["priceRetailAlt"].toFixed(2).toString().split('.').join(',');
    retailPriceArr.push(retailPrice);
    let RoubleGreyP = document.createElement("span");
    RoubleGreyP.classList.add("rouble__i", "black__i");
    productPriceDefault.append(RoubleGreyP);
    let RoubleGreyDouble = RoubleGrey.cloneNode(true);
    RoubleGreyP.append(RoubleGreyDouble);

    let productPricePoints = document.createElement("div");
    productPricePoints.classList.add("product_price_points");
    product.append(productPricePoints);
    let productPricePointsP = document.createElement("p");
    productPricePointsP.classList.add("binding");
    productPricePointsP.textContent = "Можно купить за " + products[i]["bonusAmount"] + " баллов";
    productPricePoints.append(productPricePointsP);

    let listUnitPadd = document.createElement("div");
    listUnitPadd.classList.add("list--unit-padd");
    product.append(listUnitPadd);

    let listUnitDesc = document.createElement("div");
    listUnitDesc.classList.add("list--unit-desc");
    product.append(listUnitDesc);
    let unitInfo = document.createElement("div");
    unitInfo.classList.add("unit--info");
    listUnitDesc.append(unitInfo);
    let unitDescI = document.createElement("div");
    unitDescI.classList.add("unit--desc-i");
    unitInfo.append(unitDescI); 
    let unitDescT = document.createElement("div");
    unitDescT.classList.add("unit--desc-t");
    unitInfo.append(unitDescT);
    let unitDescTP = document.createElement("p");
    unitDescT.append(unitDescTP);
    let unitDescTPSpanNGBinding = document.createElement("span");
    unitDescTPSpanNGBinding.classList.add("ng-binding");
    unitDescTP.append(unitDescTPSpanNGBinding);
    unitDescTPSpanNGBinding.textContent = "Продается " + (products[i]["unitFull"] !== products[i]["unitFullAlt"] ? "упаковками" : "штуками") + ":";
    let unitDescTPSpanUnitInfoInn = document.createElement("span");
    unitDescTPSpanUnitInfoInn.classList.add("unit--infoInn");
    unitDescTP.append(unitDescTPSpanUnitInfoInn);
    unitDescTPSpanUnitInfoInn.textContent = products[i]["unitFull"] !== products[i]["unitFullAlt"] ? ("1 упак. = " + products[i]["unitRatioAlt"].toFixed(2) + " м. кв.") : "";

    let productWrapper = document.createElement("div");
    productWrapper.classList.add("product__wrapper");
    product.append(productWrapper);
    let productCountWrapper = document.createElement("div");
    productCountWrapper.classList.add("product_count_wrapper");
    productWrapper.append(productCountWrapper);
    let stepper = document.createElement("div");
    stepper.classList.add("stepper");
    productCountWrapper.append(stepper);
    let stepperInput = document.createElement("input");
    stepperInput.classList.add("product__count", "stepper-input");
    stepper.append(stepperInput);
    stepperInput.type = "text";
    stepperInput.value = "1";
    stepperInputArr.push(stepperInput);
    let stepperArrowUp = document.createElement("span");
    stepperArrowUp.classList.add("stepper-arrow", "up");
    stepper.append(stepperArrowUp);
    stepperArrowArr.push(stepperArrowUp);
    let stepperArrowDown = document.createElement("span");
    stepperArrowDown.classList.add("stepper-arrow", "down");
    stepper.append(stepperArrowDown);
    stepperArrowArr.push(stepperArrowDown);

    let btnCart = document.createElement("span");
    btnCart.classList.add("btn", "btn_cart");
    product.append(btnCart);
    btnCart.setAttribute("data-url", "/cart/");
    btnCart.setAttribute("data-product-id", `${products[i]["productId"]}`);
    let icCartDouble = IcCart.cloneNode(true);
    btnCart.append(icCartDouble);
    let btnCartNgBinding = document.createElement("span");
    btnCartNgBinding.classList.add("ng-binding");
    btnCartNgBinding.textContent = "В корзину";
    btnCart.append(btnCartNgBinding);
  }
  function chooseYourFighter(thing) {
    if (thing === "упаковка") return ("упаковку");
    if (thing === "метр квадратный") return ("м. кв.");
    if (thing === "штука") return ("штуку");
  }
}

