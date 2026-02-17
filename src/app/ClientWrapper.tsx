'use client'
import { Provider } from 'react-redux'
import { store } from "@/Redux/Store";

export default function ClientWrapper({ children }: {children: React.ReactNode}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
