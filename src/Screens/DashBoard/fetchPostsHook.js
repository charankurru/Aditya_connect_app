import { useEffect, useState } from 'react'
import axios from 'axios'
import { GetPosts } from '../../API/services';

export default function fetchPostsHook(pageNumber, channelId) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        GetPosts({ channelId: channelId, pageNumber: pageNumber, limit: 5 })
            .then(res => {
                console.log(res)
                // setUsers(prevUsers => {
                //     return [...new Set([...prevUsers, ...res.data.results.map(b => b.name)])]
                // })
                setPosts([...posts, ...res.data.result])
                setHasMore(res.data.result.length > 0)
                setLoading(false)
            }).catch(e => {
                setError(true)
            })
    }, [pageNumber])
    return { loading, error, posts, hasMore }
}
