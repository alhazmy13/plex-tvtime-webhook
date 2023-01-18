export const config = {
  tvtime: {
    token: {
      symfony: process.env.TVTIME_SYMFONY || '',
      tvstRemember:
        process.env.TVTIME_TVST_REMEMBER || ''
    }
  },
  port: Number.isInteger(parseInt(process.env.PORT || '')) ? parseInt(process.env.PORT || '') : 3000,
  host: process.env.HOST || '0.0.0.0'
};
