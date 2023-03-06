<template>
  <v-app>
    <v-main style="padding: 20px;">
      <v-combobox
        v-model="streamers"
        :items="streamers"
        multiple
        chips
        hide-details
        single
        solo
        placeholder="Выбери стримеров"
        :onChange="saveStreamersLS()"
      >
      </v-combobox>
      <div class="dashboard">
        <select
          v-model="selectedStreamer"
          size="30"
        >
          <option
            v-for="streamer in streamers"
            :value="streamer" 
            :key="streamer"
          >
            {{ streamer }}
          </option>
        </select>
        <div
          class="clips"
        >
          <img v-if="!clips.length" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/b6e0b072897469.5bf6e79950d23.gif" alt="" style="width: calc(100% + 30px); height: calc(100% + 30px); object-fit: cover; margin: -15px; filter: invert(1) hue-rotate(425deg);">
          <a
            v-for="clip in clips"
            class="clip"
            :href="clip.url"
            target="_blank"
            :key="clip.date"
          > 
            <div class="elems">
              <span>{{ clip.views }}</span>
              <span>{{ clip.duration }}</span>
              <span>{{ clip.date }}</span>
            </div>
            <img :src="clip.thumbnail" :alt="clip.name">
          </a>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'App',
  data: () => ({
    socket: null,
    streamers: [],
    selectedStreamer: null,
    clips: [],
  }),
  watch: {
    selectedStreamer(val) {
      this.socket.emit('getStreamer', val);
    }
  },
  methods: {
    saveStreamersLS() {
      localStorage.setItem('streamers', JSON.stringify(this.streamers));
    },
    getStreamersLS() {
      this.streamers = JSON.parse(localStorage.getItem('streamers')) ?? [];
    }
  },
  created() {
    this.getStreamersLS();
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    this.socket.on('getStreamer', (data) => this.clips = data)
  },
  beforeUnmount() {
    this.socket.disconnect();
  },
}
</script>

<style>
* { padding: 0; margin: 0; list-style: none; outline: 0; }

select {
  width: 15%;
  padding: 10px 0;
  background: #d9deff !important;
}

option {
  padding: 5px 15px;
}

select::-webkit-scrollbar {
  display: none;
}

.dashboard {
  display: flex;
  justify-content: flex-start;
}

.clips {
  width: 85%;
  display: flex;
  flex-wrap: wrap;
  background: #ffffcf;
  padding: 15px;
  gap: 10px;
}

.clip {
  width: 300px;
  height: 200px;
  text-decoration: none;
  position: relative;
}

.clip .elems {
  background: #d0a1ff;
  position: absolute;
  display: flex;
  bottom: 0;
  justify-content: space-between;
  width: 100%;
  padding: 5px 10px;
}

.clip span {
  font-weight: bold;
  color: #303030;
  margin: 0 10px 0 0;
}

.clip img {
  width: 100%;
  height: 100%;
}
</style>
