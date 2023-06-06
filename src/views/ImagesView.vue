<template>
  <div id="content" class="app-snextcloud">
    <AppContent>
      <b-carousel
        v-if="images && images.length"
        :interval="2000"
        style="text-shadow: 0px 0px 2px #000"
        img-width="1024"
        img-height="480"
      >
        <b-carousel-slide
          v-for="item in images"
          caption="First Slide"
          :img-src="item.path"
          :key="item.key"
        ></b-carousel-slide>
      </b-carousel>
    </AppContent>
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
import { createClient, AuthType } from "webdav";
import { generateRemoteUrl } from "@nextcloud/router";
import { getCurrentUser, getRequestToken } from "@nextcloud/auth";

import "@nextcloud/dialogs/styles/toast.scss";

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
    };
  },
  computed: {
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
    },
  },
  async mounted() {
    this.getAllImages();
    this.loading = false;
  },
  methods: {},
};
</script>
<style scoped>
#app-content > div {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

input[type="text"] {
  width: 100%;
}

textarea {
  flex-grow: 1;
  width: 100%;
}
.item {
  display: flex;
  border: 1px solid #c2dedc;
  margin-bottom: 20px;
  border-radius: 14px;
  text-align: center;
  color: red;
  justify-content: space-between;
}
.item span {
  margin-top: 10px;
}
.content_container {
  /* display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column; */
  margin-top: 50px;
}
.download {
  text-align: end;
}
.label {
  background-color: indigo;
  color: white;
  padding: 0.5rem;
  font-family: sans-serif;
  border-radius: 0.3rem;
  cursor: pointer;
  margin-top: 1rem;
}
.upload {
  margin-top: 20px;
  border: none;
}
.image-sample {
  width: 40px;
  height: 40px;
}
</style>
