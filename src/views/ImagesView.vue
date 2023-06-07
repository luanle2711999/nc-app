<template>
  <div>
    <div
      style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff"
      class="swiper mySwiper2"
    >
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in images" :key="item.key">
          <img :src="item.path" />
        </div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <div thumbsSlider="" class="swiper mySwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in images" :key="item.key">
          <img :src="item.path" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from "@nextcloud/vue/dist/Components/ActionButton";
import AppContent from "@nextcloud/vue/dist/Components/AppContent";
import AppNavigation from "@nextcloud/vue/dist/Components/AppNavigation";
import AppNavigationItem from "@nextcloud/vue/dist/Components/AppNavigationItem";
import AppNavigationNew from "@nextcloud/vue/dist/Components/AppNavigationNew";
import { BCarouselSlide, BCarousel, BCard } from "bootstrap-vue";
import {
  NcModal,
  NcButton,
  NcTextField,
  BCardText,
  BButton,
} from "@nextcloud/vue";
import { createClient } from "webdav";
import { generateRemoteUrl } from "@nextcloud/router";
import { getCurrentUser, getRequestToken } from "@nextcloud/auth";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css";
import "@nextcloud/dialogs/styles/toast.scss";
import "./style.css";
import { Swiper } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper";

export default {
  name: "App",
  components: {
    ActionButton,
    AppContent,
    AppNavigation,
    AppNavigationItem,
    AppNavigationNew,
    NcModal,
    NcButton,
    NcTextField,
    BCarouselSlide,
    BCarousel,
    BCard,
    BCardText,
    BButton,
  },
  data() {
    return {
      images: [],
      updating: false,
      loading: true,
      visible: false,
      swiper: null,
      swiper2: null,
    };
  },

  methods: {
    async getAllImages() {
      const client = createClient(generateRemoteUrl("dav"), {
        headers: { Requesttoken: getRequestToken() },
      });
      const response = await client.getDirectoryContents(
        `/files/${getCurrentUser()?.uid}/Photos`,
        {
          data: `<?xml version="1.0"?>
				  <d:propfind  xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
					<d:prop>
					  <d:getcontenttype />
					  <d:getlastmodified />
					  <oc:owner-id />
					  <oc:size />
					</d:prop>
				  </d:propfind>`,
        }
      );
      console.log(response);
      const urls = response.map((item) => {
        return {
          path: `${generateRemoteUrl("dav")}/${item.filename}`,
          key: item.basename,
        };
      });
      urls.shift();
      this.images = [...urls];
      return;
    },
  },

  async mounted() {
    this.loading = false;
    this.getAllImages().then(() => {
      console.log("getAllImages");
      this.$nextTick(() => {
        console.log(this.swiper);
        // this.swiper.update();
        // this.swiper2.update();
      });
    });

    this.swiper = new Swiper(".mySwiper", {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
    this.swiper2 = new Swiper(".mySwiper2", {
      loop: true,
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: this.swiper,
      },
    });

    console.log(this.swiper, this.swiper2);
  },
};
</script>
<style scoped>
html,
body {
  position: relative;
  height: 100%;
}

body {
  background: #eee;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

body {
  background: #000;
  color: #000;
}

.swiper {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
}

.mySwiper2 {
  height: 80%;
  width: 100%;
}

.mySwiper {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
}

.mySwiper .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
