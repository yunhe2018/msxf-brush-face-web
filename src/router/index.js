/* eslint-disable no-undef */
import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/Login')
const layout = () => import('@/components/common/layout')
const Device = () => import('@/components/Device/Device')
const Account = () => import('@/components/Account/Account')
const Org = () => import('@/components/Org/Org')
const Storage = () => import('@/components/Storage/Storage')
const Meeting = () => import('@/components/Meeting/Meeting')
const MeetingDevice = () => import('@/components/Meeting/MeetingDevice')
const MeetingMng = () => import('@/components/Meeting/MeetingMng')
const Record = () => import('@/components/Record')
const Auth = () => import('@/components/SysMng/Auth')
const SysMenu = () => import('@/components/SysMng/SysMenu')
const PassWord = () => import('@/components/SysMng/PassWord')
const Configuration = () => import('@/components/SysMng/Configuration')
const Disk = () => import('@/components/SysMng/Disk')
const Staff = () => import('@/components/StaffManage/Staff')
const Visitor = () => import('@/components/StaffManage/Visitor')
const Yellow = () => import('@/components/StaffManage/Yellow')
const Manage = () => import('@/components/AccessMng/Manage')
const Rule = () => import('@/components/AccessMng/Rule')
const Greeting = () => import('@/components/Greeting/Greeting')
const home = () => import('@/components/home')
const Error = () => import('@/components/Error')
const Overtime = () => import('@/components/Overtime')
const AttendMng = () => import('@/components/Attendance/AttendMng')
const AttendRule = () => import('@/components/Attendance/AttendRule')
const AttendRecord = () => import('@/components/Attendance/AttendRecord')
const AttendReport = () => import('@/components/Attendance/AttendReport')
const AttendCalendar = () => import('@/components/Attendance/AttendCalendar')
const dataServiceAddressMng = () => import('@/components/dataServiceAddressMng/index')
const Software = () => import('@/components/Software/Software')
const Remote = () => import('@/components/SysMng/Remote')
const appointManage = () => import('@/components/Meeting/appoint/index')
const appointDetail = () => import('@/components/Meeting/appoint/detail')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Login' }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/',
      redirect: '/home',
      component: layout,
      meta: {
        isLogin: true
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: home,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/device',
          name: 'Device',
          component: Device,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/account',
          name: 'Account',
          component: Account,
          meta: {
            isLogin: true
          }
        }, {
          path: '/org',
          name: 'Org',
          component: Org,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/storage',
          name: 'Storage',
          component: Storage,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/meeting',
          name: 'Meeting',
          component: Meeting,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/record',
          name: 'Record',
          component: Record,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/sys/auth',
          name: 'Auth',
          component: Auth,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/sys/menu',
          name: 'SysMenu',
          component: SysMenu,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/sys/modifyPwd',
          name: 'PassWord',
          component: PassWord,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/sys/configuration',
          name: 'Configuration',
          component: Configuration,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/sys/diskManagement',
          name: 'Disk',
          component: Disk,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/support',
          name: 'Remote',
          component: Remote,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/user/staffManage/:userRole',
          name: 'Staff',
          component: Staff,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/user/visitor',
          name: 'Visitor',
          component: Visitor,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/user/blacklist',
          name: 'Yellow',
          component: Yellow,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/access/manage',
          name: 'Manage',
          component: Manage,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/access/rule',
          name: 'Rule',
          component: Rule,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/geeting',
          name: 'Greeting',
          component: Greeting,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/attendance/manage',
          name: 'AttendMng',
          component: AttendMng,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/attendance/rule',
          name: 'AttendRule',
          component: AttendRule,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/attendance/statistic',
          name: 'AttendReport',
          component: AttendReport,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/attendance/statisticDetail',
          name: 'AttendCalendar',
          component: AttendCalendar,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/attendance/record',
          name: 'AttendRecord',
          component: AttendRecord,
          meta: {
            isLogin: true
          }

        },
        {
          path: '/mg',
          name: 'dataServiceAddressMng',
          component: dataServiceAddressMng,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/software',
          name: 'Software',
          component: Software,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/meeting/appointment',
          name: 'appointment',
          component: appointManage,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'meeting/appointDetail',
          name: 'appointDetail',
          component: appointDetail,
          meta: {
            isLogin: true
          }
        },
        {
          path: '/meeting/business',
          name: 'MeetingDevice',
          component: MeetingDevice
        },
        {
          path: '/meeting/room',
          name: 'MeetingMng',
          component: MeetingMng
        }
      ]
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/overtime',
      name: 'Overtime',
      component: Overtime,
      meta: {
        isLogin: false
      }
    }
  ]
})
