// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import localforage from 'localforage'
import { STORAGE_KEY_MAP } from 'src/constants'
import { ActionType } from 'src/types'
import type { ISettings } from 'src/types'
import navConfig from '../../nav.config.json'

const LAN_HOST_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^127\./,
]

const LAN_HOSTNAMES = new Set(['localhost', '::1'])

function isLanHostname(host?: string | null): boolean {
  if (!host) {
    return false
  }

  const value = host.toLowerCase()
  if (LAN_HOSTNAMES.has(value)) {
    return true
  }

  return LAN_HOST_PATTERNS.some((pattern) => pattern.test(value))
}

function getHostname(url?: string): string {
  if (!url) {
    return ''
  }

  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

const locationHost = (() => {
  try {
    return globalThis.location?.hostname || ''
  } catch {
    return ''
  }
})()

const lanFromConfig = isLanHostname(getHostname(navConfig.address))
const lanFromLocation = isLanHostname(locationHost)
const shouldBypassLogin = lanFromLocation && (!navConfig.address || lanFromConfig)

export function getToken() {
  return globalThis.localStorage?.getItem(STORAGE_KEY_MAP.TOKEN) || ''
}

export function getAuthCode() {
  return globalThis.localStorage.getItem(STORAGE_KEY_MAP.AUTH_CODE) || ''
}

export function removeAuthCode() {
  return globalThis.localStorage.removeItem(STORAGE_KEY_MAP.AUTH_CODE)
}

export function setAuthCode(c: string) {
  return globalThis.localStorage.setItem(STORAGE_KEY_MAP.AUTH_CODE, c.trim())
}

export function setToken(token: string) {
  return globalThis.localStorage.setItem(STORAGE_KEY_MAP.TOKEN, token)
}

export function removeToken() {
  return globalThis.localStorage.removeItem(STORAGE_KEY_MAP.TOKEN)
}

export function getImageToken() {
  return globalThis.localStorage?.getItem(STORAGE_KEY_MAP.IMAGE_TOKEN) || ''
}

export function setImageToken(token: string) {
  return globalThis.localStorage.setItem(STORAGE_KEY_MAP.IMAGE_TOKEN, token)
}

export function removeWebsite() {
  return localforage.removeItem(STORAGE_KEY_MAP.WEBSITE)
}

export function userLogout() {
  const removeKeys = [
    STORAGE_KEY_MAP.TOKEN,
    STORAGE_KEY_MAP.IMAGE_TOKEN,
    STORAGE_KEY_MAP.WEBSITE,
  ]
  localforage.clear()
  Array.from({ length: globalThis.localStorage.length }, (_, i) => {
    return globalThis.localStorage.key(i)
  }).forEach((key) => {
    if (key && removeKeys.includes(key)) {
      globalThis.localStorage.removeItem(key)
    }
  })
  Array.from({ length: globalThis.sessionStorage.length }, (_, i) => {
    return globalThis.sessionStorage.key(i)
  }).forEach((key) => {
    if (key && removeKeys.includes(key)) {
      globalThis.sessionStorage.removeItem(key)
    }
  })
}

export const isLogin: boolean = shouldBypassLogin || !!getToken()

let create: null | boolean = null
let edit: null | boolean = null
let del: null | boolean = null

export function getPermissions(settings: ISettings) {
  if (create == null) {
    create = settings.userActions.includes(ActionType.Create)
    edit = settings.userActions.includes(ActionType.Edit)
    del = settings.userActions.includes(ActionType.Delete)
  }

  const c = create || false
  const e = edit || false
  const d = del || false

  return {
    create: c,
    edit: e,
    del: d,
    ok: c || e || d,
  } as const
}
