def display(result):
    print("display is printing file")
    result_str = str(result)
    clean_str = result_str[30:-5]

    with open('output.txt','w') as file:
        file.write(clean_str)
