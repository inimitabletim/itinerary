/**
 * Application Configuration
 * Centralized settings for the itinerary app
 */

export const CONFIG = {
    // Trip Information
    trip: {
        startDate: '2026-02-17T00:00:00',
        days: [
            { date: '2026-02-17', dayNum: 1, lunar: '初一', title: '關渡祈福 & 三層崎花海' },
            { date: '2026-02-18', dayNum: 2, lunar: '初二', title: '淡水夕陽 & 頂級名廚盛宴' },
            { date: '2026-02-19', dayNum: 3, lunar: '初三', title: '陽明山花季 & 頂級森林浴' },
            { date: '2026-02-20', dayNum: 4, lunar: '初四', title: '名湯巡禮 & 暖心返程' }
        ]
    },

    // Weather API Configuration (Open-Meteo - Free, No API Key Required)
    weather: {
        enabled: true,
        location: {
            name: '北投',
            latitude: 25.1363,
            longitude: 121.5061
        },
        timezone: 'Asia/Taipei'
    },

    // Update Intervals (in milliseconds)
    intervals: {
        countdown: 1000,        // 1 second
        crowd: 60000,           // 1 minute
        weather: 1800000        // 30 minutes
    },

    // Crowd Level Thresholds (based on hour of day)
    crowd: {
        highStart: 10,
        highEnd: 19,
        medStart: 7,
        medEnd: 22
    },

    // Transport Information for each location
    transport: {
        locations: {
            '關渡宮': {
                recommendation: 'car',
                car: {
                    duration: '從台北市區約 25 分鐘',
                    parking: '水岸停車場',
                    parkingFee: '春節期間 $60/hr',
                    note: '從關渡路進入（知行路只出不進）',
                    coordinates: { lat: 25.1172, lng: 121.4667 }
                },
                publicTransport: {
                    route: '捷運關渡站 1 號出口，步行 10 分鐘',
                    bus: '紅35、小23',
                    note: '春節建議搭捷運避開車潮'
                }
            },
            '三層崎公園': {
                recommendation: 'car',
                car: {
                    duration: '從關渡宮約 15 分鐘',
                    parking: '秀山路旁停車格',
                    parkingFee: '路邊停車費率',
                    note: '停車位有限，建議 14:00 前抵達',
                    coordinates: { lat: 25.1456, lng: 121.4983 }
                },
                publicTransport: {
                    route: '捷運復興崗站，步行 15 分鐘',
                    bus: '216、218、223',
                    station: '貴子坑水土保持園區站'
                }
            },
            '淡水漁人碼頭': {
                recommendation: 'car',
                car: {
                    duration: '從北投約 30 分鐘',
                    parking: '福容大飯店地下停車場',
                    parkingFee: '$40/hr，消費滿 $500 折 1hr',
                    note: '電梯直達，長輩免走路',
                    coordinates: { lat: 25.1847, lng: 121.4097 }
                },
                publicTransport: {
                    route: '捷運淡水站轉紅26、836',
                    note: '假日人多，建議開車'
                }
            },
            '陽明山花鐘': {
                recommendation: 'bus',
                car: {
                    duration: '從北投約 40 分鐘（不塞車）',
                    parking: '花季期間極難停車',
                    note: '仰德大道 7:00-16:00 管制小客車',
                    coordinates: { lat: 25.1661, lng: 121.5406 }
                },
                publicTransport: {
                    route: '停百齡高中 → 搭花季專車 124/130/131',
                    note: '停車場有 3hr 免費優惠（需蓋章）',
                    recommended: true
                }
            },
            '二子坪步道': {
                recommendation: 'bus',
                car: {
                    note: '需先到陽明山再轉乘',
                    coordinates: { lat: 25.1819, lng: 121.5297 }
                },
                publicTransport: {
                    route: '陽明山公車總站轉 108、小8',
                    note: '全程無階梯，輪椅可通行'
                }
            },
            '大地酒店': {
                recommendation: 'car',
                car: {
                    duration: '從淡水約 25 分鐘',
                    parking: '飯店專屬停車場',
                    parkingFee: '用餐免費',
                    coordinates: { lat: 25.1375, lng: 121.5108 }
                },
                publicTransport: {
                    route: '捷運北投站/新北投站，可預約飯店接駁車',
                    note: '接駁車需提前預約'
                }
            },
            '復興公園足湯': {
                recommendation: 'metro',
                car: {
                    parking: '新北投捷運站停車場',
                    parkingFee: '平日 $30/hr',
                    coordinates: { lat: 25.1369, lng: 121.5034 }
                },
                publicTransport: {
                    route: '捷運新北投站，出站步行 3 分鐘',
                    recommended: true
                }
            }
        }
    }
};

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
