import * as React from 'react'

export interface AppProps {
    name: string
}

export default function App(props: AppProps) {
    return (
        <div>
            App {props.name}
        </div>
    )
}
