import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { GetPosts } from '../../API/services';

export default function fetchPostsHook(pageNumber, channelId, categoryChecks) {
    let onEndReachedCalledDuringMomentum = false;
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true)
    const [posts, setPosts] = useState([])
    const [filterPosts, setFilterPosts] = useState([])

    useEffect(() => {
        setTimeout(() => {
            if (hasMore) {
                getMore();
            }
        }, 100);
    }, [pageNumber]);

    const performFilteringPosts = useCallback(() => {
        if (categoryChecks) {
            let filteredPosts = posts.filter(post => categoryChecks[post.categoryId])
            console.log(filteredPosts)
            filteredPosts = filteredPosts.length == 0 ? posts : filteredPosts
            setFilterPosts(filteredPosts);
        }
        else {
            console.log("In else")
            setFilterPosts(posts);
        }
    }, [posts]);

    const getPosts = async () => {
        try {
            if (pageNumber == 1) {
                setPosts([]);
                setFilterPosts([]);
            }
            const res = await GetPosts(
                { channelId: "1232", pageNumber: pageNumber, limit: 5 })
            console.log(res)
            setPosts([...posts, ...res.data.result])
            setHasMore(res.data.result.length > 0)
            performFilteringPosts()
        } catch (error) {
            console.log(error)
        }
    }

    const getMore = () => {
        setIsMoreLoading(true)
        setTimeout(async () => {
            await getPosts();
            setIsMoreLoading(false)
            onEndReachedCalledDuringMomentum = true;
        }, 100);
    }

    return { isMoreLoading, posts, filterPosts, hasMore, onEndReachedCalledDuringMomentum, setFilterPosts }
}
