<template>
  <div class="resources-page">
    <h2>{{ langText.title }}</h2>

    <!-- 新增地图功能区域 -->
    <section class="map-section">
      <h3>{{ langText.mapSection.title }}</h3>
      <div class="map-controls">
        <div class="search-group">
          <input 
            v-model="searchQuery"
            :placeholder="langText.mapSection.searchPlaceholder"
            @keyup.enter="searchPOI"
          />
          <button @click="searchPOI">
            <i class="search-icon">🔍</i>
          </button>
        </div>
        
        <div class="route-group">
          <div>
            <label>{{ langText.mapSection.from }}</label>
            <input v-model="routeFrom" />
          </div>
          <div>
            <label>{{ langText.mapSection.to }}</label>
            <input v-model="routeTo" />
          </div>
          <button @click="calculateRoute">
            {{ langText.mapSection.getRoute }}
          </button>
        </div>
      </div>
      
      <div class="map-container">
        <div ref="map" class="map"></div>
      </div>
    </section>

    <section class="resource-section">
      <h3>{{ langText.section1.title }}</h3>
      <ul>
        <li v-for="(item, idx) in langText.section1.items" :key="idx">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.label }}</a> — <small>{{ item.desc }}</small>
        </li>
      </ul>
    </section>

    <section class="resource-section">
      <h3>{{ langText.section2.title }}</h3>
      <ul>
        <li v-for="(item, idx) in langText.section2.items" :key="idx">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.label }}</a> — <small>{{ item.desc }}</small>
        </li>
      </ul>
    </section>

    <section class="resource-section">
      <h3>{{ langText.section3.title }}</h3>
      <ul>
        <li v-for="(item, idx) in langText.section3.items" :key="idx">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.label }}</a> — <small>{{ item.desc }}</small>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { inject, computed, ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'Resources',
  setup() {
    const state = inject('language');
    const map = ref(null);
    const mapInstance = ref(null);
    const searchQuery = ref('');
    const routeFrom = ref('');
    const routeTo = ref('');
    const poiMarkers = ref([]);
    const routeLayer = ref(null);
    const routeStatus = ref('');
    const routeError = ref('');

    // 移民相关兴趣点类别（根据主题定制）
    const POI_CATEGORIES_CN = [
      '移民局',
      '语言学校',
      '社区中心',
      '国际诊所',
      '多元文化超市',
      '政府服务中心'
    ];
    const POI_CATEGORIES_EN = [
      'Immigration Office',
      'Language School',
      'Community Center',
      'International Clinic',
      'Multicultural Supermarket',
      'Government Service Center'
    ];

    const langText = computed(() =>
      state.language === '中文'
        ? {
            title: '资源中心',
            mapSection: {
              title: '移民服务地图',
              searchPlaceholder: '搜索移民服务点...',
              from: '起点:',
              to: '终点:',
              getRoute: '获取路线',
              categories: POI_CATEGORIES_CN
            },
            section1: {
              title: '移民注意事项',
              items: [
                {
                  label: '澳洲移民官方指南',
                  url: 'https://www.homeaffairs.gov.au/',
                  desc: '政府移民政策与流程',
                },
                {
                  label: '移民生活贴士论坛',
                  url: 'https://www.expatexchange.com/',
                  desc: '经验分享与问答社区',
                },
                {
                  label: '本地法律援助',
                  url: 'https://www.fairwork.gov.au/',
                  desc: '劳工权益与法律咨询',
                },
              ],
            },
            section2: {
              title: '心理健康教育',
              items: [
                {
                  label: 'Beyond Blue',
                  url: 'https://www.beyondblue.org.au/',
                  desc: '焦虑与抑郁支持资源',
                },
                {
                  label: 'Head to Health',
                  url: 'https://www.headtohealth.gov.au/',
                  desc: '全国心理健康服务目录',
                },
                {
                  label: 'TED 心理讲座',
                  url: 'https://www.ted.com/topics/mental+health',
                  desc: '国际心理健康主题演讲',
                },
              ],
            },
            section3: {
              title: '身体健康小知识',
              items: [
                {
                  label: 'Healthdirect',
                  url: 'https://www.healthdirect.gov.au/',
                  desc: '专业医疗信息与症状检查',
                },
                {
                  label: '澳洲健康生活网站',
                  url: 'https://www.eatforhealth.gov.au/',
                  desc: '营养与饮食建议',
                },
                {
                  label: 'NIH 健康百科',
                  url: 'https://www.nih.gov/health-information',
                  desc: '国际权威健康百科',
                },
              ],
            },
          }
        : {
            title: 'Resources Hub',
            mapSection: {
              title: 'Immigration Services Map',
              searchPlaceholder: 'Search immigration services...',
              from: 'From:',
              to: 'To:',
              getRoute: 'Get Route',
              categories: POI_CATEGORIES_EN
            },
            section1: {
              title: 'Immigration Essentials',
              items: [
                {
                  label: 'Australia Immigration Guide',
                  url: 'https://www.homeaffairs.gov.au/',
                  desc: 'Official policy & processes',
                },
                {
                  label: 'Expat Exchange Forum',
                  url: 'https://www.expatexchange.com/',
                  desc: 'Community Q&A and tips',
                },
                {
                  label: 'Fair Work Ombudsman',
                  url: 'https://www.fairwork.gov.au/',
                  desc: 'Work rights & legal advice',
                },
              ],
            },
            section2: {
              title: 'Mental Health Education',
              items: [
                {
                  label: 'Beyond Blue',
                  url: 'https://www.beyondblue.org.au/',
                  desc: 'Anxiety & depression support',
                },
                {
                  label: 'Head to Health',
                  url: 'https://www.headtohealth.gov.au/',
                  desc: 'National mental health services',
                },
                {
                  label: 'TED Mental Health Talks',
                  url: 'https://www.ted.com/topics/mental+health',
                  desc: 'International expert talks',
                },
              ],
            },
            section3: {
              title: 'Physical Wellness Tips',
              items: [
                {
                  label: 'Healthdirect',
                  url: 'https://www.healthdirect.gov.au/',
                  desc: 'Symptom checker & advice',
                },
                {
                  label: 'Eat for Health',
                  url: 'https://www.eatforhealth.gov.au/',
                  desc: 'Nutrition & diet guidelines',
                },
                {
                  label: 'NIH Health Info',
                  url: 'https://www.nih.gov/health-information',
                  desc: 'Authoritative health encyclopedia',
                },
              ],
            },
          }
    );

    // 初始化地图
    onMounted(() => {
      mapInstance.value = L.map(map.value, {zoomAnimation: false}).setView([-25.2744, 133.7751], 4); // 澳洲中心坐标
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.value);
    });

    // 搜索兴趣地点
    const searchPOI = async () => {
      if (!searchQuery.value.trim()) return;
      
      // 清除之前的标记
      clearMarkers();
      
      try {
        // 使用Nominatim API搜索
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery.value)}&format=json&countrycodes=au&limit=10`
        );
        
        const results = await response.json();
        
        results.forEach(result => {
          const marker = L.marker([result.lat, result.lon])
            .addTo(mapInstance.value)
            .bindPopup(`<b>${result.display_name}</b>`);
          
          poiMarkers.value.push(marker);
        });
        
        if (results.length > 0) {
          mapInstance.value.fitBounds(L.latLngBounds(
            results.map(r => [r.lat, r.lon])
          ));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // 计算路线
    const calculateRoute = async () => {
      if (!routeFrom.value.trim() || !routeTo.value.trim()) return;
      
      // 清除之前的路线
      if (routeLayer.value) {
        mapInstance.value.removeLayer(routeLayer.value);
      }
      
      try {
        const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImFlYTBiYTQzZTMwZjQwYzQ5MmNiYmEzOTY1OWM2MmJjIiwiaCI6Im11cm11cjY0In0=';
        
        // 获取起点和终点坐标
        const fromResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(routeFrom.value)}&format=json&limit=1`
        );
        
        const toResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(routeTo.value)}&format=json&limit=1`
        );
        
        const [fromResults, toResults] = await Promise.all([fromResponse, toResponse]);
        const [fromData] = await fromResults.json();
        const [toData] = await toResults.json();
        
        if (!fromData || !toData) throw new Error('无法找到地点坐标');
        
        // 获取路线 - 使用正确的API端点和格式
        const routeResponse = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
          {
            method: 'POST',
            headers: {
              'Authorization': apiKey,
              'Content-Type': 'application/json',
              'Accept': 'application/geo+json'
            },
            body: JSON.stringify({
              coordinates: [
                [parseFloat(fromData.lon), parseFloat(fromData.lat)],
                [parseFloat(toData.lon), parseFloat(toData.lat)]
              ]
            })
          }
        );
        
        // 检查响应状态
        if (!routeResponse.ok) {
          const errorData = await routeResponse.json();
          throw new Error(`API错误: ${errorData.error.message || routeResponse.statusText}`);
        }
        
        const routeData = await routeResponse.json();
        
        // 调试：打印API响应
        console.log('OpenRouteService响应:', routeData);
        
        // 提取路线坐标（根据实际API响应结构）
        let routeCoordinates = [];
        
        // 检查不同的响应格式
        if (routeData.features && routeData.features.length > 0) {
          // GeoJSON格式
          routeCoordinates = routeData.features[0].geometry.coordinates;
        } else if (routeData.routes && routeData.routes.length > 0) {
          // 旧版JSON格式
          routeCoordinates = routeData.routes[0].geometry.coordinates;
        } else {
          throw new Error('无法解析路线数据');
        }
        
        // 转换为Leaflet需要的[lat, lon]格式
        const leafletCoordinates = routeCoordinates.map(coord => [coord[1], coord[0]]);
        
        // 绘制路线
        routeLayer.value = L.polyline(leafletCoordinates, {
          color: '#1e90ff',
          weight: 6
        }).addTo(mapInstance.value);
        
        // 添加起点和终点标记
        const startMarker = L.marker([fromData.lat, fromData.lon])
          .addTo(mapInstance.value)
          .bindPopup(`<b>起点</b><br>${routeFrom.value}`);
        
        const endMarker = L.marker([toData.lat, toData.lon])
          .addTo(mapInstance.value)
          .bindPopup(`<b>终点</b><br>${routeTo.value}`);
        
        // 调整地图视图
        const bounds = L.latLngBounds(leafletCoordinates);
        mapInstance.value.fitBounds(bounds);
        
        // 保存标记以便清除
        poiMarkers.value.push(startMarker, endMarker);
        
      } catch (error) {
        console.error('路线计算失败:', error);
        alert(`路线计算失败: ${error.message}`);
      }
    };

    // 获取地点坐标的辅助函数
    const getCoordinates = async (locationName) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
        );
        
        const results = await response.json();
        if (results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lon: parseFloat(results[0].lon)
          };
        }
        return null;
      } catch (error) {
        console.error('坐标获取失败:', error);
        return null;
      }
    };

    // 清除标记
    const clearMarkers = () => {
      poiMarkers.value.forEach(marker => {
        mapInstance.value.removeLayer(marker);
      });
      poiMarkers.value = [];
    };

    return { 
      langText, 
      map,
      searchQuery,
      routeFrom,
      routeTo,
      searchPOI,
      calculateRoute,
      routeStatus,
      routeError,
    };
  },
};
</script>

<style scoped>
.resources-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
}
.resource-section {
  margin-bottom: 40px;
}
.resource-section h3 {
  border-left: 4px solid #1e90ff;
  padding-left: 10px;
  margin-bottom: 15px;
  color: #333;
}
.resource-section ul {
  list-style: none;
  padding: 0;
}
.resource-section li {
  margin-bottom: 10px;
  font-size: 1rem;
}
.resource-section a {
  color: #1e90ff;
  text-decoration: none;
}
.resource-section a:hover {
  text-decoration: underline;
}
.resource-section small {
  color: #666;
}
/* 新增地图相关样式 */
.map-section {
  margin-bottom: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.map-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 15px;
  background-color: #f8f9fa;
}

.search-group, .route-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-group input {
  width: 250px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.route-group div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.route-group input {
  width: 150px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 15px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0b7dda;
}

.map-container {
  height: 500px;
}

.map {
  height: 100%;
  width: 100%;
}

/* 原有样式保持不变 */
.resources-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}
.route-status {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.route-status.success {
  background-color: #d4edda;
  color: #155724;
}

.route-status.error {
  background-color: #f8d7da;
  color: #721c24;
}

.route-status.calculating {
  background-color: #fff3cd;
  color: #856404;
}
</style>
