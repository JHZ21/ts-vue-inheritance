import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators"
import store from "@/store"
import { ReadType } from "@/utils/interface"
import { getLocalForage, setLocalForage } from "@/utils/localForage"
import { addReadVolume } from "@/api/learn"

export interface oContentUrlType {
  [propName: string]: string
}

export interface ILearnState {
  oContentUrl: oContentUrlType | null
  read: ReadType
}

@Module({ dynamic: true, store, name: "learn" })
class Learn extends VuexModule implements ILearnState {
  public oContentUrl: oContentUrlType | null = null
  public read: ReadType = {
    dailyRead: {
      oldRead: [],
      timeStamp: 0
    },
    sign: "",
    newRead: []
  }

  @Mutation
  private SET_OCONTETNURL(oContentUrl: oContentUrlType) {
    this.oContentUrl = oContentUrl
  }

  @Mutation
  private ADD_NEWREAD(articleId: string) {
    console.log("ADD_NEWREAD")
    if (!this.read.newRead) this.read.newRead = []
    this.read.newRead.push(articleId)
  }

  @Mutation
  public SET_READ(read: ReadType) {
    this.read = read
  }

  @Action
  public SetOContentUrl(oContentUrl: oContentUrlType) {
    this.SET_OCONTETNURL(oContentUrl)
  }

  @Action
  async SendReadThenStore() {
    const read: ReadType = this.read
    let isAdded: boolean = false
    if (!read || !read.dailyRead || read.dailyRead.timeStamp > +new Date()) {
      //timeStamp时间不允许，则拒绝
      console.log(`时间不允许: ${new Date(read.dailyRead.timeStamp)}`)
      return isAdded
    }
    // 向后端发送请求
    const res = await addReadVolume(read)

    console.log("addReadVolume res.data: ", res.data)
    if (res && res.data) {
      const data = res.data
      if (data.dailyRead && data.sign) {
        // dailyRead ,有数据更新，本地进行覆盖
        const read = {
          dailyRead: data.dailyRead,
          sign: data.sign,
          newRead: data.newRead || []
        }
        // 保存于Vuex
        this.SET_READ(read)
        // 保存于local
        setLocalForage("read", read)
        if (data.code === 200) {
          // 数据库内容有更新
          isAdded = true
        }
      }
    }
    return isAdded
  }

  @Action
  public async AddNewRead(articleId: string) {
    const oldRead: string[] = this.read.dailyRead.oldRead
    const newRead: string[] = this.read.newRead
    let isAdded: boolean = false
    if (!oldRead.includes(articleId) && !newRead.includes(articleId)) {
      this.ADD_NEWREAD(articleId)
      // 发送给后端 read
      isAdded = await this.SendReadThenStore()
    }
    return isAdded
  }

  // 第一次从 尝试从 local 、 back-end 获取
  @Action
  public GetRead() {
    console.log("GetRead")
    const readKey = "read"
    // forage read 不设置过期
    getLocalForage("read")
      .then(read => {
        if (read) {
          const { dailyRead, sign, newRead } = read as ReadType
          this.SET_READ({
            dailyRead,
            sign,
            newRead: newRead || []
          })
        }
        return ""
      })
      .then(() => {
        // 向后端请求，更新数据
        this.SendReadThenStore()
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const LearnModule = getModule(Learn)
