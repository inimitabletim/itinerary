/**
 * Application Configuration
 * Centralized settings for the itinerary app
 */

export const CONFIG = {
    trip: {
        startDate: '2026-02-17T00:00:00',
        days: [
            { date: '2026-02-17', dayNum: 1, lunar: '初一', title: '關渡祈福 & 三層崎花海' },
            { date: '2026-02-18', dayNum: 2, lunar: '初二', title: '淡水夕陽 & 頂級名廚盛宴' },
            { date: '2026-02-19', dayNum: 3, lunar: '初三', title: '陽明山花季 & 頂級森林浴' },
            { date: '2026-02-20', dayNum: 4, lunar: '初四', title: '名湯巡禮 & 暖心返程' }
        ]
    },

    weather: {
        enabled: true,
        location: {
            name: '北投',
            latitude: 25.1363,
            longitude: 121.5061
        },
        timezone: 'Asia/Taipei'
    },

    intervals: {
        countdown: 1000,
        crowd: 60000,
        weather: 1800000
    },

    cnyHoliday: {
        year: 2026,
        start: '2026-02-14',
        end: '2026-02-22',
        lunarDays: {
            '2026-02-16': { day: 0, name: '除夕', weight: 0.7 },
            '2026-02-17': { day: 1, name: '初一', weight: 1.0 },
            '2026-02-18': { day: 2, name: '初二', weight: 0.85 },
            '2026-02-19': { day: 3, name: '初三', weight: 0.7 },
            '2026-02-20': { day: 4, name: '初四', weight: 0.6 },
            '2026-02-21': { day: 5, name: '初五', weight: 0.5 },
            '2026-02-22': { day: 6, name: '初六', weight: 0.4 }
        }
    },

    crowd: {
        highStart: 10,
        highEnd: 19,
        medStart: 7,
        medEnd: 22,

        timeSlots: [
            { start: 0, end: 6, weight: 0.2, label: '深夜' },
            { start: 6, end: 9, weight: 0.5, label: '早晨' },
            { start: 9, end: 11, weight: 0.8, label: '上午' },
            { start: 11, end: 14, weight: 1.0, label: '午間高峰' },
            { start: 14, end: 17, weight: 0.9, label: '下午' },
            { start: 17, end: 19, weight: 0.7, label: '傍晚' },
            { start: 19, end: 22, weight: 0.4, label: '夜間' },
            { start: 22, end: 24, weight: 0.2, label: '深夜' }
        ],

        locationPopularity: {
            關渡宮: 1.2,
            三層崎公園: 0.9,
            淡水漁人碼頭: 1.0,
            陽明山花鐘: 1.3,
            二子坪步道: 0.7,
            大地酒店: 0.5,
            復興公園足湯: 0.6
        },

        defaultDayWeight: 0.3,

        levels: {
            veryHigh: { min: 0.8, text: '極高', color: '#ff4d4f' },
            high: { min: 0.6, text: '高', color: '#fa8c16' },
            medium: { min: 0.4, text: '中等', color: '#faad14' },
            low: { min: 0, text: '低', color: '#52c41a' }
        }
    },

    transport: {
        locations: {
            關渡宮: {
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
            三層崎公園: {
                recommendation: 'car',
                car: {
                    duration: '從關渡宮約 15 分鐘',
                    parking: '秀山路旁停車格',
                    parkingFee: '路邊停車費率',
                    note: '停車位有限，傍晚時段較好停',
                    coordinates: { lat: 25.1456, lng: 121.4983 }
                },
                publicTransport: {
                    route: '捷運復興崗站，步行 15 分鐘',
                    bus: '216、218、223',
                    station: '貴子坑水土保持園區站'
                }
            },
            淡水漁人碼頭: {
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
            陽明山花鐘: {
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
            二子坪步道: {
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
            大地酒店: {
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
            復興公園足湯: {
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
