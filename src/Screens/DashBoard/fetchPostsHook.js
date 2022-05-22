import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { GetPosts } from '../../API/services';

export default function fetchPostsHook(pageNumber, channelId, categoryChecks, setPageNumber) {
    // let onEndReachedCalledDuringMomentum = false;
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true)
    const [posts, setPosts] = useState([])
    const [filterPosts, setFilterPosts] = useState([])
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            console.log("pull refresh")
            if (hasMore) {
                getMore();
            }
        }, 100);
    }, [pageNumber]);

    const checkForNoFilter = () => {
        if (categoryChecks) {
            for (var key in categoryChecks) {
                if (categoryChecks[key]) {
                    console.log(categoryChecks[key])
                    return false
                }
            }
        }
        return true
    }

    const performFilteringPosts = () => {
        if (checkForNoFilter()) {
            console.log("No filters applied")
            return
        }
        console.log(pageNumber)
        if (categoryChecks) {
            let filteredPosts = posts.filter(post => categoryChecks[post.categoryId])
            if (hasMore && filteredPosts.length == 0) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
            setFilterPosts(filteredPosts);
        }
        else {
            console.log("In else")
            setFilterPosts(posts);
        }
    }

    const getPosts = async () => {
        try {
            if (pageNumber == 1) {
                console.log("setting arrays to empty")
                setPosts([]);
                setFilterPosts([]);
                console.log(posts.length)
                console.log(filterPosts.length)
            }
            console.log(pageNumber)
            const res = await GetPosts(
                { channelId: "1232", pageNumber: pageNumber, limit: 5 })
            setPosts([...posts, ...res.data.result])
            setHasMore(res.data.result.length > 0)
            if (!categoryChecks) {
                setFilterPosts(res.data.result)
                return
            }
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
            setOnEndReachedCalledDuringMomentum(true)
        }, 100);
    }

    return { isMoreLoading, posts, filterPosts, hasMore, onEndReachedCalledDuringMomentum, setFilterPosts, setOnEndReachedCalledDuringMomentum }
}
