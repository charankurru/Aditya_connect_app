import { useEffect, useState } from 'react'
import axios from 'axios'
import { GetPosts } from '../../API/services';

export default function fetchPostsHook(pageNumber, channelId) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(async () => {
        try {
            // setLoading(true)
            const res = await GetPosts({ channelId: channelId, pageNumber: pageNumber, limit: 5 })
            console.log("data fetched")
            // setLoading(false)
            console.log(res)
            setPosts([...posts, ...res.data.result])
            setHasMore(res.data.result.length > 0)

        } catch (error) {
            console.log(error)
        }
    }, [pageNumber])
    return { loading, error, posts, hasMore }
}
