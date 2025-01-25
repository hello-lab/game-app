import random
def get_result(e=2**52, div=33, g=0.5):
    """Returns a valid multiplier based on 3 inputed parameters

    Args:
        e (int, optional): Extreme Value. Defaults to 2**52.
        div (int, optional): Initial Crash Rate. Defaults to 33.
        g (int, optional): Growth Rate. Defaults to 1.

    Returns:
        Float: A multiplier value based on the crash equation
    """
    e = int(e)
    h = round(random.uniform(0, e-1))
    g = checkg(g)
    div = checkdiv(div)
    if (h % div == 0):
        return 1
    return 0.99 * (pow(e/(e-h), 1/g)) + 0.01

# Error checking growth value (Helper Function)
def checkg(g):
    g = round(g, 1)
    if (g == 0):
        return 1
    return g


# Error checking multiplier value (Helper Function)
def checkm(m):
    if (m < 1):
        return 1
    return round(m, 2)


# Error checking initial fail-rate value (Helper Function)
def checkdiv(div):
    if (div < 1):
        return 33
    return round(div, 2)
print(get_result())