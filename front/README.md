```
curl -fsSL https://get.pnpm.io/install.sh | sh -
Creating a Producer
pnpm create rsbuild@latest
? Input target folder -> federation_provider
? Select framework -> React
? Select language -> TypeScript
cd federation_provider
pnpm add @module-federation/enhanced
1. Starting the Producer
pnpm run dev

Creating a Consumer

pnpm create rsbuild@latest

? Input target folder -> federation_consumer
? Select framework -> React
? Select language -> TypeScript

cd federation_consumer
pnpm add @module-federation/enhanced

Starting the Consumer
pnpm run dev

Summary#
Through the above process, you have completed the export of a component from a 'producer' for use by a 'consumer' based on Module Federation. Along the way, you have preliminarily used and understood the configurations of remotes, exposes, and shared in the Module Federation plugin.


pnpm add tailwindcss -D


Creating a ui Producer
pnpm create rsbuild@latest
? Input target folder -> ui_provider
? Select framework -> React
? Select language -> TypeScript
cd ui_provider
pnpm add @module-federation/enhanced
pnpm add tailwindcss -D
pnpm add antd redux react-redux @reduxjs/toolkit @ant-design/icons 
pnpm add @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio
pnpm add @headlessui/react @heroicons/react
```