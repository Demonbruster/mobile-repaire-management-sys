/** @type {import('next').NextConfig} */

const getAllAllowedEnvironmentVariables = () => {
  let out = Object.entries(process.env).reduce((vars, [name, value]) => (/^(?:__|NODE_)/.test(name) ? vars : { ...vars, [name]: value }), {})
  delete out['NEXT_RUNTIME']
  return out
}

const nextConfig = {
  reactStrictMode: true,
  env:getAllAllowedEnvironmentVariables()
}

module.exports = nextConfig
