import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivatedRoute } from '@angular/router';

let images = {
  "1": {
    name: "SOFA ĐƠN",
    src: "../../../assets/images/sofa-type/Airm chair.JPG",
    price: 1300000
  },
  "2": {
    name: "SOFA VÒNG CUNG",
    src: "../../../assets/images/sofa-type/Arc sofa.JPG",
    price: 1500000
  },
  "3": {
    name: "SOFA GÓC",
    src: "../../../assets/images/sofa-type/Corner sofa.JPG",
    price: 1300000
  },
  "4": {
    name: "GHẾ ĐÔN",
    src: "../../../assets/images/sofa-type/Footstool.JPG",
    price: 400000
  },
  "5": {
    name: "GHẾ THƯ GIẢN ĐƠN",
    src: "../../../assets/images/sofa-type/Recliner.JPG",
    price: 2000000
  },
  "6": {
    name: "Sofa Bed",
    src: "../../../assets/images/sofa-type/Sofa bed.JPG",
    price: 1500000
  },
  "7": {
    name: "GHẾ THƯ GIẢN BA",
    src: "../../../assets/images/sofa-type/Three seater reliner.JPG",
    price: 4400000
  },
  "8": {
    name: "SOFA BĂNG BA",
    src: "../../../assets/images/sofa-type/Three seater sofa.JPG",
    price: 1300000
  },
  "9": {
    name: "SOFA BĂNG ĐÔI",
    src: "../../../assets/images/sofa-type/Two seater sofa.JPG",
    price: 1300000
  },
  "10": {
    name: "GHẾ THƯ GIẢN ĐÔI",
    src: "../../../assets/images/sofa-type/Two seater recliner.JPG",
    price: 3200000
  }
};

@Component({
  selector: 'app-bs-element',
  templateUrl: './bs-element.component.html',
  animations: [routerTransition()],
  styleUrls: ['./bs-element.component.scss'],
})
export class BsElementComponent implements OnInit {
  id: string;
  imageSource: string;
  sofaName: string;
  difficult: string;
  typeOfFoot: string;
  material: string;
  length: number;
  width: number;
  frame: number;
  totalPrice: number;
  notification: string;

  constructor(public route: ActivatedRoute) {
    window.onscroll = () => { this.scrollFunction() };
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.imageSource = images[this.id].src;
    this.sofaName = images[this.id].name;
    if (this.id === "5" || this.id === "7" || this.id === "10") {
      this.difficult = "3.75";
    }
  }

  updateDifficult(event: any) {
    this.difficult = event.target.value;
  }

  updateMaterial(event: any) {
    this.material = event.target.value;
  }

  updateTypeOfFoot(event: any) {
    this.typeOfFoot = event.target.value;
  }

  subtractWidth() {
    switch (this.id) {
      case "1":
      case "2":
      case "8":
      case "9":
        if (this.width <= 850) return 0;
        return this.width - 850;
      case "6":
        if (this.width <= 900) return 0;
        return this.width - 900;
      case "4":
        if (this.width <= 450) return 0;
        return this.width - 450;
      default:
        return this.width;
    }
  }

  checkingData(): boolean {
    if (!this.length || !this.width || this.length === 0 || this.width === 0) {
      this.notification = "Vui lòng nhập đầy đủ thông tin chiều dài & rộng"
      setTimeout(() => { this.notification = null; }, 2500);
      return false;
    }

    return true;
  }

  calculatePrice() {
    this.totalPrice = null;
    let s = 0;
    if (!this.checkingData()) return;
    let tempWidth = this.subtractWidth();

    if (this.id === "3") {
      s = this.length + tempWidth - 800;
    } else {
      s = this.length + tempWidth;
    }
    s = s / 1000;
    let unitPrice = Number(images[this.id].price) * Number(this.difficult) * Number(this.material) + Number(this.typeOfFoot);
    this.totalPrice = s * unitPrice;
  }

  updateFrame(event) {
    let typeOfFrame = event.target.value;
    switch (typeOfFrame) {
      case "1":
        this.frame = 0;
        break;
      case "2":
        if (this.id === "5") {
          this.frame = 2000000;
        } else {
          this.frame = 3000000;
        }
        break;
      default:
        this.frame = 500000;
        break

    }
  }

  calculatePriceRecliner() {
    this.totalPrice = Number(images[this.id].price) * Number(this.difficult) * Number(this.material) + this.frame;
  }

  isRecliner(): boolean {
    if (this.id === "5" || this.id === "7" || this.id === "10") {
      return true;
    }
    return false;
  }

  scrollFunction() {
    if (document.getElementById("scrollToTop") === null) {
      return
    }
    if (document.documentElement.scrollTop > 20) {
      document.getElementById("scrollToTop").style.display = "block";
    } else {
      document.getElementById("scrollToTop").style.display = "none";
    }
  }

  topFunction() {
    const smoothScroll = (h) => {
      let i = h || 0;
      if (i >= 0) {
        setTimeout(() => {
          window.scrollTo(0, i);
          smoothScroll(i - 10);
        }, 10);
      }
    };
    smoothScroll(document.documentElement.scrollTop);
  }
}
