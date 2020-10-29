import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { Logger } from '@oceanprotocol/lib'
import { LogLevel } from '@oceanprotocol/lib/dist/node/utils/Logger'
import { useOcean } from '@oceanprotocol/react'

interface UserPreferencesValue {
  debug: boolean
  currency: string
  locale: string
  bookmarks: string[]
  setDebug: (value: boolean) => void
  setCurrency: (value: string) => void
  addBookmark: (did: string) => void
  removeBookmark: (did: string) => void
}

const UserPreferencesContext = createContext(null)

function getLocalStorage(networkId: number): UserPreferencesValue {
  const localStorageKey = `ocean-user-preferences-${networkId}`

  const storageParsed =
    typeof window !== 'undefined' &&
    JSON.parse(window.localStorage.getItem(localStorageKey))
  return storageParsed
}

function setLocalStorage(
  values: Partial<UserPreferencesValue>,
  networkId: number
) {
  const localStorageKey = `ocean-user-preferences-${networkId}`

  return (
    typeof window !== 'undefined' &&
    window.localStorage.setItem(localStorageKey, JSON.stringify(values))
  )
}

function UserPreferencesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { networkId } = useOcean()

  // Set default values
  const [debug, setDebug] = useState<boolean>(false)
  const [currency, setCurrency] = useState<string>('EUR')
  const [bookmarks, setBookmarks] = useState([])
  const [locale, setLocale] = useState<string>()

  // Update from localStorage on mount & network change
  useEffect(() => {
    if (!networkId) return

    const { debug, currency, bookmarks } = getLocalStorage(networkId)
    setDebug(debug)
    setCurrency(currency)
    setBookmarks(bookmarks)
  }, [networkId])

  // Write values to localStorage on change
  useEffect(() => {
    if (!networkId) return
    setLocalStorage({ debug, currency, bookmarks }, networkId)
  }, [debug, currency, bookmarks])

  // Set ocean.js log levels, default: Error
  useEffect(() => {
    debug === true
      ? Logger.setLevel(LogLevel.Verbose)
      : Logger.setLevel(LogLevel.Error)
  }, [debug])

  // Get locale always from user's browser
  useEffect(() => {
    if (!window) return
    setLocale(window.navigator.language)
  }, [])

  function addBookmark(didToAdd: string): void {
    const newPinned = [didToAdd].concat(bookmarks)
    setBookmarks(newPinned)
  }

  function removeBookmark(didToAdd: string): void {
    const newPinned = bookmarks.filter((did: string) => did !== didToAdd)
    setBookmarks(newPinned)
  }

  return (
    <UserPreferencesContext.Provider
      value={
        {
          debug,
          currency,
          locale,
          bookmarks,
          setDebug,
          setCurrency,
          addBookmark,
          removeBookmark
        } as UserPreferencesValue
      }
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

// Helper hook to access the provider values
const useUserPreferences = (): UserPreferencesValue =>
  useContext(UserPreferencesContext)

export { UserPreferencesProvider, useUserPreferences, UserPreferencesValue }
