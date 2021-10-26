interface ConfigDefinition {
    db: {
        host?: string
        port?: string
        database?: string
        path?: string
        username?: string
        password?: string
        ssl?:boolean
        max?:number
        idle_timeout?:number
        connect_timeout?:number
        no_prepare?:boolean
        types?:any[]
        onnotice?:any
        onparameter?:any
        debug?:any
        transform?: {
            column?:any
            value?:any
            row?:any
        },
        connection?: {
            application_name ?: string
            [key: string]: any
        },
        target_session_attrs?:any
        fetch_array_types?:boolean
    }
}