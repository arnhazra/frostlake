import React from 'react'

function ReactIfComponent(props: { condition: boolean | undefined; children: React.ReactNode }): JSX.Element {
    return props.condition === undefined || !props.condition ? <></> : <>{props.children}</>
}

export default ReactIfComponent