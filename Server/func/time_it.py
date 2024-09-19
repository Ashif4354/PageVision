from datetime import datetime

def time_it(func):
    def wrapper(*args, **kwargs):
        starttime = datetime.now()
        print("Start time: ", starttime)
        result = func(*args, **kwargs)
        endtime = datetime.now()
        print("End time: ", endtime)
        print("Time taken: ", endtime - starttime)
        return result
    return wrapper



# if __name__ == "__main__":
#     @time_it
#     def test():
#         print("Hello")
    
#     test()
    
#     print("Done")