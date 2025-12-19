let watchId = null;

const target = {
  latitude: 0,
  longitude: 0,
};

const options = {
  enableHighAccuracy: false,
  timeout: 60000,
  maximumAge: 30000,
};

// 表示用要素
const statusEl = document.getElementById("status");
const latEl = document.getElementById("lat");
const lonEl = document.getElementById("lon");
const accEl = document.getElementById("acc");
const distEl = document.getElementById("dist");

// 距離計算（m）
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 初回取得
function firstSuccess(pos) {
  const c = pos.coords;

  statusEl.textContent = "状態：初回取得成功";
  latEl.textContent = "緯度：" + c.latitude;
  lonEl.textContent = "経度：" + c.longitude;
  accEl.textContent = "精度：" + c.accuracy + " m";

  watchId = navigator.geolocation.watchPosition(
    watchSuccess,
    geoError,
    options
  );
}

// 更新処理
function watchSuccess(pos) {
  const c = pos.coords;

  const d = distance(
    c.latitude,
    c.longitude,
    target.latitude,
    target.longitude
  );

  statusEl.textContent = "状態：更新中";
  latEl.textContent = "緯度：" + c.latitude;
  lonEl.textContent = "経度：" + c.longitude;
  accEl.textContent = "精度：" + c.accuracy + " m";
  distEl.textContent = "目標までの距離：" + d.toFixed(1) + " m";

  if (d < 10) {
    statusEl.textContent = "🎉 到達しました";
    navigator.geolocation.clearWatch(watchId);
  }
}

// エラー表示
function geoError(err) {
  statusEl.textContent =
    `エラー(${err.code})：${err.message}`;
}

// 実行開始
statusEl.textContent = "状態：位置情報を取得中...";
navigator.geolocation.getCurrentPosition(
  firstSuccess,
  geoError,
  options
);
