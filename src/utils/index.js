import Compressor from 'compressorjs'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

export const compressImage = async (file) => {
  return await new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 200,
      maxHeight: 200,
      mimeType: 'image/png',
      success(result) {
        resolve(result)
      },
      error(err) {
        reject(err)
      },
    })
  })
}

export const getFirebaseStorageDownloadURL = async (fullPath) => {
  return await new Promise((resolve) => {
    getDownloadURL(ref(getStorage(), fullPath))
      .then((url) => {
        resolve(url)
      })
      .catch(() => {
        resolve(null)
      })
  })
}
