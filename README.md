# FindMyself Admin

![Next Version](https://img.shields.io/badge/Next-^14.2.3-black.svg)
![TypeScript Version](https://img.shields.io/badge/TypeScript-^5-blue.svg)

A web application for managing floor plan and access point data

💻 [Deployed App](http://35.219.33.38/) | 📄 [User Manual](https://ristek.link/UserManual-FindMyselfAdmin)

## Requirements

`Node.js` and `npm`

## Configuration

### Development

1. Install all dependencies

```bash
npm install
# or
npm i
```
2. Create `.env` file in the root directory of the project

```env
# change value with the base URL of the API
NEXT_PUBLIC_BASE_URL=http://35.219.115.59
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

### Production

1. Build the docker image

```bash
docker build -t <tag> --build-arg NEXT_PUBLIC_BASE_URL=<API_BASE_URL> .

# example
docker build -t website --build-arg NEXT_PUBLIC_BASE_URL=http://35.219.115.59 .
```

2. Run the docker image

```bash
docker run -p <Host Port>:<Container Port> <tag>

# example
docker run -p 8080:80 website
```

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Leaflet Documentation](https://leafletjs.com/) - learn about Leaflet.
