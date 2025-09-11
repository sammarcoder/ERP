'use client'
import React, { useEffect } from 'react'

const ClassFilter = () => {
    const BaseUrl = `http://${window.location.hostname}:5000/api/z-classes/get-by-class-id/${id}`
    useEffect(() => {
        async function getByCassId() {
            const response = await fetch(BaseUrl)
            const post = await response.json()
            console.log(post)
        }
        getByCassId()
    }, [])

    return (
        <div>
<button>

</button>
        </div>
    )
}

export default ClassFilter